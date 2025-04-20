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


users_to_delete = []

for user in inactive_users:
    if len(users_to_delete) > 100:
        break
    user_id = str(user['_id'])
    owned_items = {}

    # Check each collection
    for collection_name in other_collections:
        collection = db[collection_name]
        items = collection.find({'ownerid': user_id})

        for item in items:
            if collection_name not in owned_items:
                owned_items[collection_name] = []
            owned_items[collection_name].append(str(item["_id"]))


    # Store user information along with ownership details
    user_info = {
        'user_id': user_id,
        'username': user.get('username', 'N/A'),
        'last_auth': user.get('lastAuthOn', 'N/A'),
        'owned_items': owned_items
    }

    users_to_delete.append(user_info)

    # Print details for each user
    print(f"\nUser: {user_info['username']}")
    print(f"Last authentication: {user_info['last_auth']}")

    if owned_items:
        print("This user owns items in the following collections:")
        for coll, ids in owned_items.items():
            print(f"  - {coll}: {', '.join(ids)}")
    else:
        print("This user doesn't own any items in other collections")

# Summary
print("\n--- SUMMARY ---")
print(f"Total inactive users: {len(inactive_users)}")
print(f"Number of users to delete: {len(users_to_delete)}")


for user in users_to_delete:
    print(f"Deleting user: {user['username']}")
    for coll, ids in user['owned_items'].items():
        binascii_ids = [ObjectId(id) for id in ids]
        db[coll].delete_many({'_id': {'$in': binascii_ids}})
        print(f"  - Deleted {len(ids)} items from {coll}")

    user_collection.delete_one({'_id': ObjectId(user['user_id'])})
