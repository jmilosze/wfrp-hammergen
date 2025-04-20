import os
from pymongo import MongoClient
from datetime import datetime, timedelta
import pytz
from bson import ObjectId

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

db = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)

user_collection = db['user']
other_collections = [
    'character', 'item', 'mutation', 'prayer', 'property',
    'rune', 'skill', 'spell', 'talent', 'trait'
]

# Calculate the date 2 years ago from now
two_years_ago = datetime.now(pytz.utc) - timedelta(days=365*2)

# Find users who haven't authenticated in over 2 years
inactive_users = list(user_collection.find({
    'lastAuthOn': {'$lt': two_years_ago}
}))

print(f"Found {len(inactive_users)} users who haven't authenticated in over 2 years")

# Check if these users own items in other collections
inactive_users_with_no_items = []

for user in inactive_users:
    if len(inactive_users_with_no_items) > 100:
        break
    user_id = str(user['_id'])
    owns_items = False
    owned_items = {}

    # Check each collection
    for collection_name in other_collections:
        collection = db[collection_name]
        items_count = collection.count_documents({'ownerid': user_id})

        if items_count > 0:
            owns_items = True
            owned_items[collection_name] = items_count

    # Store user information along with ownership details
    user_info = {
        'user_id': user_id,
        'username': user.get('username', 'N/A'),
        'last_auth': user.get('lastAuthOn', 'N/A'),
        'owns_items': owns_items,
        'owned_items': owned_items
    }

    if not owns_items:
        inactive_users_with_no_items.append(user_info)

    # Print details for each user
    print(f"\nUser: {user_info['username']}")
    print(f"Last authentication: {user_info['last_auth']}")
    if owns_items:
        print("This user owns items in the following collections:")
        for coll, count in owned_items.items():
            print(f"  - {coll}: {count} items")
    else:
        print("This user doesn't own any items in other collections")

# Summary
print("\n--- SUMMARY ---")
print(f"Total inactive users: {len(inactive_users)}")
print(f"Inactive users with no items: {len(inactive_users_with_no_items)}")

# Delete inactive users who don't own any items using bulk delete
user_ids = [ObjectId(user['user_id']) for user in inactive_users_with_no_items]
if user_ids:
    result = user_collection.delete_many({'_id': {'$in': user_ids}})
    print(f"Bulk deleted {result.deleted_count} inactive users with no items")
