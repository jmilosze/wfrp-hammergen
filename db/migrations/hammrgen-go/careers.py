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

source_collection = source_db["career"]
target_collection = target_db["career"]

new_careers = []
for career in source_collection.find():
    new_careers.append({
        "_id": career["_id"],
        "ownerid": career["owner_id"],
        "object": {
            "name": career["name"],
            "description": career["description"],
            "shared": career["shared"],
            "source": career["source"],
            "species": career["species"],
            "level1": career["level_1"],
            "level2": career["level_2"],
            "level3": career["level_3"],
            "level4": career["level_4"],
            "class": career["class"],
        }
    })

target_collection.insert_many(new_careers)
