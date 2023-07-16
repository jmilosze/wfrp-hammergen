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

source_collection = source_db["talent"]
target_collection = target_db["talent"]

new_talents = []
for talent in source_collection.find():
    new_talents.append({
        "_id": talent["_id"],
        "ownerid": talent["owner_id"],
        "object": {
            "name": talent["name"],
            "description": talent["description"],
            "tests": talent["tests"],
            "maxrank": talent["max_rank"],
            "attribute": talent["max_rank_att"],
            "isgroup": talent["is_group"],
            "group": talent["group"],
            "modifiers": {
                "size": talent["modifiers"]["size"],
                "movement": talent["modifiers"]["movement"],
                "attributes": {
                    "ag": talent["modifiers"]["attributes"]["Ag"],
                    "bs": talent["modifiers"]["attributes"]["BS"],
                    "dex": talent["modifiers"]["attributes"]["Dex"],
                    "fel": talent["modifiers"]["attributes"]["Fel"],
                    "i": talent["modifiers"]["attributes"]["I"],
                    "int": talent["modifiers"]["attributes"]["Int"],
                    "s": talent["modifiers"]["attributes"]["S"],
                    "t": talent["modifiers"]["attributes"]["T"],
                    "wp": talent["modifiers"]["attributes"]["WP"],
                    "ws": talent["modifiers"]["attributes"]["WS"],
                }
            },
            "shared": talent["shared"],
            "source": talent["source"],
        }
    })

target_collection.insert_many(new_talents)
