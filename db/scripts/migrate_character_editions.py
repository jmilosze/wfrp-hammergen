#!/usr/bin/env python3
"""
Sets `edition: "4e"` on every character without an edition (plan P2, docs/5e/plans/p2-edition-api.md).

  before: { _id, ownerid, visibility, object: { ... } }
  after:  { _id, ownerid, visibility, edition: "4e", object: { ... } }

Idempotent: characters that already have an edition are not touched.
"""
import argparse
import os
import sys
from pymongo import MongoClient

DEFAULT_MONGO_URI = os.environ.get(
    "MONGO_URI", "mongodb://admin:admin@localhost:27017"
)
DEFAULT_DB_NAME = os.environ.get("DB_NAME", "hammergenGo")

COLLECTION = "character"
EDITION = "4e"


def counts(db):
    coll = db[COLLECTION]
    return {
        "total": coll.count_documents({}),
        "without": coll.count_documents({"edition": {"$exists": False}}),
        "4e": coll.count_documents({"edition": EDITION}),
    }


def print_counts(c):
    print(f"{'collection':<12} {'total':>8} {'no edition':>12} {'edition 4e':>12}")
    print(f"{COLLECTION:<12} {c['total']:>8} {c['without']:>12} {c['4e']:>12}")


def verify(before, after):
    errors = []
    if after["total"] != before["total"]:
        errors.append(f"total changed from {before['total']} to {after['total']}")
    if after["without"] != 0:
        errors.append(f"{after['without']} character(s) still have no edition")
    if after["4e"] != after["total"]:
        errors.append(f"{after['total'] - after['4e']} character(s) have an edition other than '{EDITION}'")
    return errors


def main():
    parser = argparse.ArgumentParser(
        description=f"Set edition '{EDITION}' on characters without an edition."
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
        help="Only print counts, make no changes",
    )
    args = parser.parse_args()

    client = MongoClient(args.uri)
    db = client[args.db]

    if COLLECTION not in db.list_collection_names():
        print(f"Error: collection '{COLLECTION}' missing in '{args.db}'", file=sys.stderr)
        sys.exit(1)

    print(f"Database: {args.db}")
    before = counts(db)
    print_counts(before)

    to_migrate = before["without"]
    print(f"\nCharacters to migrate: {to_migrate}")

    if args.dry_run:
        return

    if to_migrate == 0:
        print("Nothing to migrate.")
    else:
        try:
            confirmation = (
                input(f"Set edition '{EDITION}' on {to_migrate} character(s) in '{args.db}'? (type 'yes' to confirm): ")
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
        res = db[COLLECTION].update_many(
            {"edition": {"$exists": False}},
            {"$set": {"edition": EDITION}},
        )
        print(f"  - {COLLECTION}: migrated {res.modified_count} character(s)")

    print("\nVerifying...")
    after = counts(db)
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
