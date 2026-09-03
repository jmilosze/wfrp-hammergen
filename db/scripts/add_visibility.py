#!/usr/bin/env python3
"""
Migration script to add a root-level 'visibility' integer enum to all Warhammer data items.

Visibility enum mapping:
  0 = VISIBILITY_PRIVATE (accessible only by owner; ownerid != 'admin' and object.shared != True)
  1 = VISIBILITY_SHARED  (shared with linked accounts; ownerid != 'admin' and object.shared == True)
  2 = VISIBILITY_PUBLIC  (official / global items; ownerid == 'admin')

Target collections:
  career, character, item, mutation, prayer, property,
  rune, skill, spell, talent, trait
"""

import argparse
import os
import sys
from typing import Dict, Tuple
from pymongo import MongoClient, UpdateOne
from pymongo.collection import Collection

# Integer enum definitions
VISIBILITY_PRIVATE = 0
VISIBILITY_SHARED = 1
VISIBILITY_PUBLIC = 2

DATA_COLLECTIONS = [
    "career",
    "character",
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


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Add root-level 'visibility' integer enum field to all Warhammer data items in MongoDB."
    )
    parser.add_argument(
        "--uri",
        type=str,
        default=os.environ.get("MONGO_URI", "mongodb://localhost:27017"),
        help="MongoDB connection URI (defaults to MONGO_URI env var or 'mongodb://localhost:27017')",
    )
    parser.add_argument(
        "--db",
        type=str,
        default=os.environ.get("DB_NAME", "hammergen"),
        help="Database name (defaults to DB_NAME env var or 'hammergen')",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Simulate the migration without writing changes to the database",
    )
    parser.add_argument(
        "-y",
        "--yes",
        action="store_true",
        help="Skip interactive confirmation prompt and proceed with migration",
    )
    return parser.parse_args()


def determine_visibility(doc: dict) -> int:
    """
    Determines visibility enum based on document properties:
      - If ownerid == 'admin' -> Public (2)
      - Else if object.shared is True -> Shared (1)
      - Else -> Private (0)
    """
    owner_id = str(doc.get("ownerid", "")).strip().lower()
    if owner_id == "admin":
        return VISIBILITY_PUBLIC

    obj = doc.get("object")
    if isinstance(obj, dict) and obj.get("shared") is True:
        return VISIBILITY_SHARED

    return VISIBILITY_PRIVATE


def analyze_collection(coll: Collection) -> Tuple[int, Dict[int, int], list]:
    """
    Analyzes documents in the collection and prepares bulk update operations.
    Returns: (total_docs, visibility_counts, bulk_operations)
    """
    visibility_counts = {
        VISIBILITY_PRIVATE: 0,
        VISIBILITY_SHARED: 0,
        VISIBILITY_PUBLIC: 0,
    }
    bulk_ops = []
    total_docs = 0

    cursor = coll.find({}, {"_id": 1, "ownerid": 1, "object.shared": 1, "visibility": 1})
    for doc in cursor:
        total_docs += 1
        new_vis = determine_visibility(doc)
        visibility_counts[new_vis] += 1

        # Check if the document already has the exact same visibility value
        if doc.get("visibility") != new_vis:
            bulk_ops.append(
                UpdateOne(
                    {"_id": doc["_id"]},
                    {"$set": {"visibility": new_vis}},
                )
            )

    return total_docs, visibility_counts, bulk_ops


def main() -> None:
    args = parse_arguments()

    print("==================================================")
    print(" HAMMERGEN MIGRATION: ADD 'visibility' ENUM")
    print("==================================================")
    print(f"Target DB: {args.db}")
    print(f"Dry Run:   {args.dry_run}")
    print(f"Enum:      0 = Private, 1 = Shared, 2 = Public")
    print("--------------------------------------------------")

    try:
        client = MongoClient(args.uri, serverSelectionTimeoutMS=5000)
        # Verify connectivity
        client.admin.command("ping")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}", file=sys.stderr)
        sys.exit(1)

    db = client[args.db]
    existing_collections = set(db.list_collection_names())

    collections_to_process = [c for c in DATA_COLLECTIONS if c in existing_collections]
    missing_collections = [c for c in DATA_COLLECTIONS if c not in existing_collections]

    if missing_collections:
        print(f"Note: Collections not found in database (skipped): {', '.join(missing_collections)}")

    if not collections_to_process:
        print("No target data collections found in database. Exiting.")
        sys.exit(0)

    print("\nAnalyzing collections...")
    migration_plan = {}
    grand_total_docs = 0
    grand_total_updates = 0
    grand_counts = {VISIBILITY_PRIVATE: 0, VISIBILITY_SHARED: 0, VISIBILITY_PUBLIC: 0}

    for coll_name in collections_to_process:
        coll = db[coll_name]
        total_docs, vis_counts, bulk_ops = analyze_collection(coll)
        migration_plan[coll_name] = {
            "total_docs": total_docs,
            "vis_counts": vis_counts,
            "bulk_ops": bulk_ops,
        }
        grand_total_docs += total_docs
        grand_total_updates += len(bulk_ops)
        for k in grand_counts:
            grand_counts[k] += vis_counts[k]

    # Print summary table
    print("\nCOLLECTION SUMMARY:")
    print(f"{'Collection':<14} | {'Total':<7} | {'Private (0)':<12} | {'Shared (1)':<11} | {'Public (2)':<11} | {'Updates Needed':<14}")
    print("-" * 84)
    for coll_name, data in migration_plan.items():
        vc = data["vis_counts"]
        print(
            f"{coll_name:<14} | {data['total_docs']:<7} | {vc[VISIBILITY_PRIVATE]:<12} | "
            f"{vc[VISIBILITY_SHARED]:<11} | {vc[VISIBILITY_PUBLIC]:<11} | {len(data['bulk_ops']):<14}"
        )
    print("-" * 84)
    print(
        f"{'TOTAL':<14} | {grand_total_docs:<7} | {grand_counts[VISIBILITY_PRIVATE]:<12} | "
        f"{grand_counts[VISIBILITY_SHARED]:<11} | {grand_counts[VISIBILITY_PUBLIC]:<11} | {grand_total_updates:<14}"
    )
    print("==================================================")

    if grand_total_updates == 0:
        print("\nAll items already have correct visibility values. Nothing to update.")
        sys.exit(0)

    if args.dry_run:
        print("\n[Dry Run] No database changes were made.")
        sys.exit(0)

    if not args.yes:
        confirmation = (
            input(
                f"\nAre you sure you want to update {grand_total_updates} documents across {len(migration_plan)} collections? (yes/no): "
            )
            .strip()
            .lower()
        )
        if confirmation != "yes":
            print("Migration aborted by user. No data was modified.")
            sys.exit(0)

    print("\nExecuting migration...")
    for coll_name, data in migration_plan.items():
        bulk_ops = data["bulk_ops"]
        if not bulk_ops:
            continue

        coll = db[coll_name]
        # Execute in batches of 1000 for efficiency
        batch_size = 1000
        modified_count = 0
        for i in range(0, len(bulk_ops), batch_size):
            batch = bulk_ops[i : i + batch_size]
            res = coll.bulk_write(batch, ordered=False)
            modified_count += res.modified_count

        print(f"  - '{coll_name}': successfully updated {modified_count} documents.")

    print("\nMigration completed successfully.")


if __name__ == "__main__":
    main()
