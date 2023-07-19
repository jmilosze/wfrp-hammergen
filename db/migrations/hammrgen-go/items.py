import os
import sys

from pymongo import MongoClient
from bson import ObjectId

MONGO_URI = os.environ["MONGO_URI"]
SOURCE_DB_NAME = os.environ["DB_NAME"]
TARGET_DB_NAME = f"{SOURCE_DB_NAME}-go"

print(f"Are you sure you want to run this migration in {MONGO_URI}?")
x = input()
if x != "yes":
    sys.exit()

source_db = MongoClient(MONGO_URI, 27017).get_database(name=SOURCE_DB_NAME)
target_db = MongoClient(MONGO_URI, 27017).get_database(name=TARGET_DB_NAME)

source_collection = source_db["item"]
target_collection = target_db["item"]

new_items = []
for item in source_collection.find():
    new_items.append({
        "_id": item["_id"],
        "ownerid": item["owner_id"],
        "object": {
            "name": item["name"],
            "description": item["description"],
            "type": item["stats"]["type"],
            "shared": item["shared"],
            "source": item["source"],
            "price": item["price"],
        }
    })

target_collection.insert_many(new_items)
