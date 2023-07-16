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

source_collection = source_db["skill"]
target_collection = target_db["skill"]

new_skills = []
for skill in source_collection.find():
    new_skills.append({
        "_id": skill["_id"],
        "ownerid": skill["owner_id"],
        "object": {
            "name": skill["name"],
            "description": skill["description"],
            "type": skill["type"],
            "displayzero": skill["display_zero"],
            "group": skill["group"],
            "attribute": skill["attribute"],
            "isgroup": skill["is_group"],
            "shared": skill["shared"],
            "source": skill["source"],
        }
    })

target_collection.insert_many(new_skills)
