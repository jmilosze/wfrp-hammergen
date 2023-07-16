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

source_collection = source_db["spell"]
target_collection = target_db["spell"]

new_spells = []
for spell in source_collection.find():
    new_spells.append({
        "_id": spell["_id"],
        "ownerid": spell["owner_id"],
        "object": {
            "name": spell["name"],
            "description": spell["description"],
            "cn": spell["cn"],
            "range": spell["range"],
            "target": spell["target"],
            "duration": spell["duration"],
            "shared": spell["shared"],
            "source": spell["source"],
        }
    })

target_collection.insert_many(new_spells)
