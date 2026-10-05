#!/usr/bin/env python3
"""
Imports 5e content of one type from its data file in docs/5e/data (plan C6b, docs/5e/03-tracker.md),
e.g. --type trait reads traits-5e.json.

Entries with `id4e` add `editions.5e` to that public 4e document.
Entries without `id4e` create new public 5e-only documents, owned by the owner of the public 4e documents.
Already imported 5e-only documents are found by their 5e name, so renaming such an entry in the data file
after an import creates a new document (rename the existing one first).

Idempotent: variants that are already imported unchanged are skipped.
Already imported variants that differ from the data file are replaced only with --update.
Nothing is written if any target document is missing or not public.
"""
import argparse
import json
import os
import sys
from pathlib import Path

from bson import ObjectId
from pymongo import MongoClient

DEFAULT_MONGO_URI = os.environ.get(
    "MONGO_URI", "mongodb://admin:admin@localhost:27017"
)
DEFAULT_DB_NAME = os.environ.get("DB_NAME", "hammergenGo")
DATA_DIR = Path(__file__).resolve().parents[2] / "docs/5e/data"

VISIBILITY_PUBLIC = 2
ATTRIBUTES = ["ws", "bs", "s", "t", "i", "ag", "dex", "int", "wp", "fel"]


def modifiers_variant(entry):
    modifiers = entry.get("modifiers", {})
    attributes = modifiers.get("attributes", {})
    unknown = set(attributes) - set(ATTRIBUTES)
    if unknown:
        raise ValueError(f"{entry['name']}: unknown attributes {sorted(unknown)}")
    return {
        "size": modifiers.get("size", 0),
        "movement": modifiers.get("movement", 0),
        "attributes": {a: attributes.get(a, 0) for a in ATTRIBUTES},
        "effects": modifiers.get("effects", []),
    }


def trait_variant(entry):
    return {
        "name": entry["name"],
        "description": entry["description"],
        "modifiers": modifiers_variant(entry),
        "hasvalue": entry["hasValue"],
        "source": entry["source"],
    }


def mutation_variant(entry):
    return {
        "name": entry["name"],
        "description": entry["description"],
        "type": entry["type"],
        "modifiers": modifiers_variant(entry),
        "source": entry["source"],
    }


def property_variant(entry):
    return {
        "name": entry["name"],
        "description": entry["description"],
        "type": entry["type"],
        "applicableto": entry["applicableTo"],
        "hasvalue": entry["hasValue"],
        "source": entry["source"],
    }


def prayer_variant(entry):
    return {
        "name": entry["name"],
        "description": entry["description"],
        "range": entry["range"],
        "target": entry["target"],
        "duration": entry["duration"],
        "source": entry["source"],
    }


def spell_variant(entry):
    return {
        "name": entry["name"],
        "description": entry["description"],
        "cn": entry["cn"],
        "range": entry["range"],
        "target": entry["target"],
        "duration": entry["duration"],
        "classification": {"type": entry["classification"]["type"], "labels": entry["classification"]["labels"]},
        "source": entry["source"],
    }


def talent_variant(entry):
    # 5e talents have a fixed max rank only (no characteristic-based rank) and no Tests line.
    return {
        "name": entry["name"],
        "description": entry["description"],
        "tests": "",
        "maxrank": entry["maxRank"],
        "attribute": 0,
        "attribute2": 0,
        "isgroup": entry["isGroup"],
        "modifiers": modifiers_variant(entry),
        "group": entry["group"],
        "source": entry["source"],
    }


def skill_variant(entry):
    return {
        "name": entry["name"],
        "description": entry["description"],
        "type": entry["type"],
        "displayzero": entry["displayZero"],
        "group": entry["group"],
        "attribute": entry["attribute"],
        "isgroup": entry["isGroup"],
        "source": entry["source"],
    }


# Builds the stored 5e variant from a data file entry, per collection.
VARIANTS = {
    "trait": trait_variant,
    "mutation": mutation_variant,
    "property": property_variant,
    "prayer": prayer_variant,
    "spell": spell_variant,
    "talent": talent_variant,
    "skill": skill_variant,
}
DATA_FILES = {
    "trait": "traits-5e.json",
    "mutation": "mutations-5e.json",
    "property": "properties-5e.json",
    "prayer": "prayers-5e.json",
    "spell": "spells-5e.json",
    "talent": "talents-5e.json",
    "skill": "skills-5e.json",
}


def plan(coll, to_variant, entries):
    """Returns (attach, create, update, skipped, errors, owner) without writing anything.

    `update` lists already imported 5e variants that differ from the data file, as (document id, variant)."""
    attach, create, update, skipped, errors = [], [], [], [], []
    owners = set()

    for entry in entries:
        variant = to_variant(entry)
        if entry["id4e"] is None:
            existing = list(coll.find({"visibility": VISIBILITY_PUBLIC, "editions.5e.name": variant["name"]}))
            if len(existing) > 1:
                errors.append(f"{variant['name']}: {len(existing)} public documents already have this 5e name")
            elif existing and existing[0]["editions"]["5e"] != variant:
                update.append((existing[0]["_id"], variant))
            elif existing:
                skipped.append(variant["name"])
            else:
                create.append(variant)
            continue

        doc = coll.find_one({"_id": ObjectId(entry["id4e"])})
        if doc is None:
            errors.append(f"{variant['name']}: 4e document {entry['id4e']} not found")
        elif doc["visibility"] != VISIBILITY_PUBLIC:
            errors.append(f"{variant['name']}: 4e document {entry['id4e']} is not public")
        elif "4e" not in doc["editions"]:
            errors.append(f"{variant['name']}: document {entry['id4e']} has no 4e variant")
        else:
            owners.add(doc["ownerid"])
            current = doc["editions"].get("5e")
            if current == variant:
                skipped.append(variant["name"])
            elif current is not None:
                update.append((doc["_id"], variant))
            else:
                attach.append((doc["_id"], doc["editions"]["4e"]["name"], variant))

    if len(owners) != 1:
        errors.append(f"expected one owner of the public 4e documents, found {sorted(owners)}")

    return attach, create, update, skipped, errors, owners.pop() if len(owners) == 1 else None


def apply(coll, attach, create, update, owner):
    for doc_id, _, variant in attach:
        coll.update_one({"_id": doc_id}, {"$set": {"editions.5e": variant}})
    for doc_id, variant in update:
        coll.update_one({"_id": doc_id}, {"$set": {"editions.5e": variant}})
    if create:
        coll.insert_many(
            [{"ownerid": owner, "visibility": VISIBILITY_PUBLIC, "editions": {"5e": v}} for v in create]
        )


def main():
    parser = argparse.ArgumentParser(description="Import 5e content of one type.")
    parser.add_argument("--type", required=True, choices=sorted(VARIANTS), help="Content type to import")
    parser.add_argument(
        "--uri",
        default=DEFAULT_MONGO_URI,
        help="MongoDB URI (defaults to MONGO_URI env var or mongodb://admin:admin@localhost:27017)",
    )
    parser.add_argument(
        "--db",
        default=DEFAULT_DB_NAME,
        help="Database name (defaults to DB_NAME env var or hammergenGo)",
    )
    parser.add_argument(
        "--data",
        default=None,
        type=Path,
        help=f"Data file (defaults to the type's file in {DATA_DIR})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Only print what would be imported, make no changes",
    )
    parser.add_argument(
        "--update",
        action="store_true",
        help="Replace already imported 5e variants that differ from the data file",
    )
    args = parser.parse_args()

    data = args.data or DATA_DIR / DATA_FILES[args.type]
    entries = json.loads(data.read_text())
    coll = MongoClient(args.uri)[args.db][args.type]
    to_variant = VARIANTS[args.type]

    print(f"Database: {args.db}")
    print(f"Data:     {data} ({len(entries)} entries)")

    attach, create, update, skipped, errors, owner = plan(coll, to_variant, entries)

    print(f"\nAdd 5e variant to existing document: {len(attach)}")
    for doc_id, name4e, variant in attach:
        rename = "" if name4e == variant["name"] else f" (4e: {name4e})"
        print(f"  - {variant['name']}{rename} [{doc_id}]")
    print(f"\nCreate 5e-only document: {len(create)}")
    for variant in create:
        print(f"  - {variant['name']}")
    print(f"\nAlready imported but different, replace with --update: {len(update)}")
    for doc_id, variant in update:
        print(f"  - {variant['name']} [{doc_id}]")
    print(f"\nAlready imported, skipped: {len(skipped)}")

    if update and not args.update:
        errors.append(f"{len(update)} imported 5e variant(s) differ from the data file; use --update to replace them")

    if errors:
        print("\nErrors (nothing was written):", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    if args.dry_run:
        return

    if not attach and not create and not update:
        print("\nNothing to import.")
    else:
        print(f"\nOwner of new documents: {owner}")
        try:
            confirmation = (
                input(
                    f"Import {len(attach)} variant(s), {len(create)} new document(s) and replace {len(update)} variant(s) "
                    f"in '{args.db}'? "
                    "(type 'yes' to confirm): "
                )
                .strip()
                .lower()
            )
        except (KeyboardInterrupt, EOFError):
            print("\nAborted by user. No changes were made.")
            sys.exit(0)

        if confirmation != "yes":
            print("Confirmation was not 'yes'. Aborted without making any changes.")
            sys.exit(0)

        print("\nImporting...")
        apply(coll, attach, create, update, owner)

    print("\nVerifying...")
    attach, create, update, skipped, errors, _ = plan(coll, to_variant, entries)
    if attach or create or update or errors or len(skipped) != len(entries):
        print(
            f"Verification FAILED: {len(attach) + len(create)} {args.type}(s) missing, {len(update)} different",
            file=sys.stderr,
        )
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    print(f"Verification passed: all {len(entries)} entries are imported.")


if __name__ == "__main__":
    main()
