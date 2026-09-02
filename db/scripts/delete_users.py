import os
import random
import sys
from datetime import datetime, timedelta
from pymongo import MongoClient
import pytz

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

user_collection = db["user"]

# Collections that store user-owned resources
other_collections = [
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

# 1. Calculate cutoff date (4 years ago from now in UTC)
four_years_ago = datetime.now(pytz.utc) - timedelta(days=365 * 4)

# 2. Find all active users (logged in within the last 4 years)
active_users = list(
    user_collection.find(
        {
            "lastAuthOn": {"$gte": four_years_ago},
        }
    )
)

# Collect all sharedAccountIds referenced by active users
active_shared_account_ids = set()
for u in active_users:
    shared_ids = u.get("sharedAccountIds") or []
    for sid in shared_ids:
        active_shared_account_ids.add(str(sid))

# 3. Find all inactive users (not authenticated for > 4 years or never authenticated)
inactive_users = list(
    user_collection.find(
        {
            "$or": [
                {"lastAuthOn": {"$lt": four_years_ago}},
                {"lastAuthOn": None},
                {"lastAuthOn": {"$exists": False}},
            ]
        }
    )
)

# 4. Filter inactive users: exclude those who appear in active users' sharedAccountIds
users_to_delete = []
excluded_shared_users = []

for u in inactive_users:
    user_id_str = str(u["_id"])
    if user_id_str in active_shared_account_ids:
        excluded_shared_users.append(u)
    else:
        users_to_delete.append(u)

# 5. Find items in other collections owned by users in the deletion candidate list
candidate_user_ids = [str(u["_id"]) for u in users_to_delete]

existing_collections = db.list_collection_names()
items_to_delete_by_collection = {}
total_items_count = 0

for coll_name in other_collections:
    if coll_name not in existing_collections:
        continue
    coll = db[coll_name]
    matched_items = list(coll.find({"ownerid": {"$in": candidate_user_ids}}))
    items_to_delete_by_collection[coll_name] = matched_items
    total_items_count += len(matched_items)

# 6. Print summary & statistics
print("==========================================")
print(" USER CLEANUP ANALYSIS")
print("==========================================")
print(f"Cutoff timestamp (4 years ago UTC): {four_years_ago.isoformat()}")
print(f"Total active users (logged in within 4 years): {len(active_users)}")
print(f"Total inactive users (not logged in >4 years): {len(inactive_users)}")
print(
    f"Inactive users excluded (referenced in active sharedAccountIds): {len(excluded_shared_users)}"
)
print(f"Final inactive users candidate list for deletion: {len(users_to_delete)}")
print("------------------------------------------")
print("ITEMS OWNED BY INACTIVE CANDIDATE USERS:")
for coll_name, items in items_to_delete_by_collection.items():
    print(f"  - {coll_name}: {len(items)} items")
print("------------------------------------------")
print(f"Total items across all collections: {total_items_count}")
print("==========================================")

# 7. Print full details of 10 random users from the delete list
if users_to_delete:
    sample_count = min(10, len(users_to_delete))
    sample_users = random.sample(users_to_delete, sample_count)
    print(f"\nDETAILS OF {sample_count} RANDOM USERS FROM CANDIDATE DELETE LIST:")
    print("==========================================")
    for i, user in enumerate(sample_users, 1):
        user_id_str = str(user["_id"])
        print(f"[{i}] User ID: {user_id_str}")
        print(f"    Username: {user.get('username', 'N/A')}")
        print(f"    Created On: {user.get('createdOn', 'N/A')}")
        print(f"    Last Auth On: {user.get('lastAuthOn', 'N/A')}")
        print(f"    Admin: {user.get('admin', False)}")
        print(f"    Shared Account IDs: {user.get('sharedAccountIds', [])}")

        user_owned_counts = {}
        for coll_name, items in items_to_delete_by_collection.items():
            count = sum(
                1 for item in items if str(item.get("ownerid")) == user_id_str
            )
            if count > 0:
                user_owned_counts[coll_name] = count

        if user_owned_counts:
            items_summary = ", ".join(
                f"{c}: {cnt}" for c, cnt in user_owned_counts.items()
            )
            print(f"    Owned Resources: {items_summary}")
        else:
            print("    Owned Resources: None")
        print()

# 8. User confirmation prompt before deletion
if not users_to_delete:
    print("No users to delete. Exiting.")
    sys.exit(0)

confirmation = (
    input(
        f"Are you sure you want to PERMANENTLY DELETE {len(users_to_delete)} users and their {total_items_count} resources? (yes/no): "
    )
    .strip()
    .lower()
)

if confirmation != "yes":
    print("Deletion cancelled by user. No data was modified.")
    sys.exit(0)

# 9. Perform deletion
print("\nProceeding with deletion...")
for coll_name in other_collections:
    if coll_name not in existing_collections:
        continue
    coll = db[coll_name]
    res = coll.delete_many({"ownerid": {"$in": candidate_user_ids}})
    print(f"  - Deleted {res.deleted_count} documents from '{coll_name}'")

user_ids_to_delete_obj = [u["_id"] for u in users_to_delete]
user_res = user_collection.delete_many({"_id": {"$in": user_ids_to_delete_obj}})
print(f"  - Deleted {user_res.deleted_count} users from 'user' collection")

print("\nCleanup completed successfully.")
