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

source_collection = source_db["property"]
target_collection = target_db["property"]

new_properties = []
for property in source_collection.find():
    new_properties.append({
        "_id": property["_id"],
        "ownerid": property["owner_id"],
        "object": {
            "name": property["name"],
            "description": property["description"],
            "type": property["type"],
            "applicableto": property["applicable_to"],
            "shared": property["shared"],
            "source": property["source"],
        }
    })

target_collection.insert_many(new_properties)
