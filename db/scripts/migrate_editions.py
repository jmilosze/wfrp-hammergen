#!/usr/bin/env python3
"""
Migrates content documents from `object` to `editions.4e` (plan P1, docs/5e/plans/p1-edition-variants.md).

  before: { _id, ownerid, visibility, object: { ... } }
  after:  { _id, ownerid, visibility, editions: { "4e": { ... } } }

Characters (`character`) and generation props (`other`) are not migrated.
Idempotent: already migrated documents are not touched.
"""
import argparse
import os
import sys
from pymongo import MongoClient

DEFAULT_MONGO_URI = os.environ.get(
    "MONGO_URI", "mongodb://admin:admin@localhost:27017"
)
DEFAULT_DB_NAME = os.environ.get("DB_NAME", "hammergenGo")

CONTENT_COLLECTIONS = [
    "career",
    "item",
    "mutation",
    "prayer",
    "property",
    "rune",
    "skill",
    "spell",
    "talent",
    "trait",
]

OLD_FIELD = "object"
NEW_FIELD = "editions.4e"


def collection_counts(db):
    counts = {}
    for coll_name in CONTENT_COLLECTIONS:
        coll = db[coll_name]
        counts[coll_name] = {
            "total": coll.count_documents({}),
            "old": coll.count_documents({OLD_FIELD: {"$exists": True}}),
            "new": coll.count_documents({NEW_FIELD: {"$exists": True}}),
        }
    return counts


def print_counts(counts):
    print(f"{'collection':<12} {'total':>8} {OLD_FIELD:>8} {NEW_FIELD:>12}")
    for coll_name, c in counts.items():
        print(f"{coll_name:<12} {c['total']:>8} {c['old']:>8} {c['new']:>12}")


def migrate(db):
    for coll_name in CONTENT_COLLECTIONS:
        res = db[coll_name].update_many(
            {OLD_FIELD: {"$exists": True}},
            {"$rename": {OLD_FIELD: NEW_FIELD}},
        )
        print(f"  - {coll_name}: migrated {res.modified_count} document(s)")


def verify(before, after):
    errors = []
    for coll_name in CONTENT_COLLECTIONS:
        b, a = before[coll_name], after[coll_name]
        if a["total"] != b["total"]:
            errors.append(f"{coll_name}: total changed from {b['total']} to {a['total']}")
        if a["old"] != 0:
            errors.append(f"{coll_name}: {a['old']} document(s) still have '{OLD_FIELD}'")
        if a["new"] != a["total"]:
            errors.append(
                f"{coll_name}: {a['total'] - a['new']} document(s) have no '{NEW_FIELD}'"
            )
    return errors


def main():
    parser = argparse.ArgumentParser(
        description="Migrate content documents from 'object' to 'editions.4e'."
    )
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
        "--dry-run",
        action="store_true",
        help="Only print per-collection counts, make no changes",
    )
    args = parser.parse_args()

    client = MongoClient(args.uri)
    db = client[args.db]

    existing_collections = db.list_collection_names()
    missing = [c for c in CONTENT_COLLECTIONS if c not in existing_collections]
    if missing:
        print(f"Error: collections missing in '{args.db}': {', '.join(missing)}", file=sys.stderr)
        sys.exit(1)

    print(f"Database: {args.db}")
    before = collection_counts(db)
    print_counts(before)

    to_migrate = sum(c["old"] for c in before.values())
    print(f"\nDocuments to migrate: {to_migrate}")

    if args.dry_run:
        return

    if to_migrate == 0:
        print("Nothing to migrate.")
    else:
        try:
            confirmation = (
                input(f"Migrate {to_migrate} document(s) in '{args.db}'? (type 'yes' to confirm): ")
                .strip()
                .lower()
            )
        except (KeyboardInterrupt, EOFError):
            print("\nAborted by user. No changes were made.")
            sys.exit(0)

        if confirmation != "yes":
            print("Confirmation was not 'yes'. Aborted without making any changes.")
            sys.exit(0)

        print("\nMigrating...")
        migrate(db)

    print("\nVerifying...")
    after = collection_counts(db)
    print_counts(after)
    errors = verify(before, after)
    if errors:
        print("\nVerification FAILED:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    print("\nVerification passed.")


if __name__ == "__main__":
    main()
