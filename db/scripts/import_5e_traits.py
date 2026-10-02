#!/usr/bin/env python3
"""
Imports 5e creature traits from docs/5e/data/traits-5e.json (plan C6b, docs/5e/03-tracker.md).

Entries with `id4e` add `editions.5e` to that public 4e document.
Entries without `id4e` create new public 5e-only documents, owned by the owner of the public 4e traits.

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
DEFAULT_DATA_FILE = Path(__file__).resolve().parents[2] / "docs/5e/data/traits-5e.json"

COLLECTION = "trait"
VISIBILITY_PUBLIC = 2
ATTRIBUTES = ["ws", "bs", "s", "t", "i", "ag", "dex", "int", "wp", "fel"]


def to_variant(entry):
    modifiers = entry.get("modifiers", {})
    attributes = modifiers.get("attributes", {})
    unknown = set(attributes) - set(ATTRIBUTES)
    if unknown:
        raise ValueError(f"{entry['name']}: unknown attributes {sorted(unknown)}")
    return {
        "name": entry["name"],
        "description": entry["description"],
        "modifiers": {
            "size": modifiers.get("size", 0),
            "movement": modifiers.get("movement", 0),
            "attributes": {a: attributes.get(a, 0) for a in ATTRIBUTES},
            "effects": [],
        },
        "source": entry["source"],
    }


def plan(coll, entries):
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
        errors.append(f"expected one owner of the public 4e traits, found {sorted(owners)}")

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
    parser = argparse.ArgumentParser(description="Import 5e creature traits.")
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
        default=DEFAULT_DATA_FILE,
        type=Path,
        help=f"Traits data file (defaults to {DEFAULT_DATA_FILE})",
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

    entries = json.loads(args.data.read_text())
    coll = MongoClient(args.uri)[args.db][COLLECTION]

    print(f"Database: {args.db}")
    print(f"Data:     {args.data} ({len(entries)} entries)")

    attach, create, update, skipped, errors, owner = plan(coll, entries)

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
    attach, create, update, skipped, errors, _ = plan(coll, entries)
    if attach or create or update or errors or len(skipped) != len(entries):
        print(
            f"Verification FAILED: {len(attach) + len(create)} trait(s) missing, {len(update)} different",
            file=sys.stderr,
        )
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    print(f"Verification passed: all {len(entries)} traits are imported.")


if __name__ == "__main__":
    main()
