import os
import sys

from pymongo import MongoClient

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

    new_item = {
        "_id": item["_id"],
        "ownerid": item["owner_id"],
        "object": {
            "name": item["name"],
            "description": item["description"],
            "type": item["stats"]["type"],
            "shared": item["shared"],
            "source": item["source"],
            "price": item["price"],
            "availability": item["availability"],
            "enc": item["enc"],
            "properties": item["properties"],
        },
    }

    stats = item["stats"]

    if stats["type"] == 0:
        new_item["object"]["melee"] = {
            "reach": stats["reach"],
            "group": stats["group"],
            "hands": stats["hands"],
            "dmg": stats["dmg"],
            "dmgsbmult": stats["dmg_sb_mult"],
        }
    else:
        new_item["object"]["melee"] = {
            "reach": 0,
            "group": 0,
            "hands": 0,
            "dmg": 0,
            "dmgsbmult": 0,
        }

    if stats["type"] == 1:
        new_item["object"]["ranged"] = {
            "group": stats["group"],
            "hands": stats["hands"],
            "dmg": stats["dmg"],
            "dmgsbmult": stats["dmg_sb_mult"],
            "rng": stats["rng"],
            "rngsbmult": stats["rng_sb_mult"],
        }
    else:
        new_item["object"]["ranged"] = {
            "group": 0,
            "hands": 0,
            "dmg": 0,
            "dmgsbmult": 0,
            "rng": 0,
            "rngsbmult": 0,
        }

    if stats["type"] == 2:
        new_item["object"]["ammunition"] = {
            "rngmult": stats["rng_mult"],
            "group": stats["group"],
            "dmg": stats["dmg"],
            "rng": stats["rng"],
        }
    else:
        new_item["object"]["ammunition"] = {
            "rngmult": 0,
            "group": 0,
            "dmg": 0,
            "rng": 0,
        }

    if stats["type"] == 3:
        new_item["object"]["armour"] = {
            "points": stats["points"],
            "location": stats["location"],
            "group": stats["group"],
        }
    else:
        new_item["object"]["armour"] = {
            "points": 0,
            "location": 0,
            "group": 0,
        }

    if stats["type"] == 4:
        new_item["object"]["container"] = {
            "capacity": stats["capacity"],
            "carrytype": 0 if stats["wearable"] else 1,
        }
    else:
        new_item["object"]["container"] = {
            "capacity": 0,
            "carrytype": 0,
        }

    if stats["type"] == 5:
        if stats["carry_type"]["carriable"] and stats["carry_type"]["wearable"]:
            carrytype = 0
        elif stats["carry_type"]["carriable"] and not stats["carry_type"]["wearable"]:
            carrytype = 1
        else:
            carrytype = 2

        new_item["object"]["other"] = {
            "carrytype": carrytype,
        }
    else:
        new_item["object"]["other"] = {
            "carrytype": 0,
        }

    if stats["type"] == 6:
        new_item["object"]["grimoire"] = {
            "spells": stats["spells"],
        }
    else:
        new_item["object"]["grimoire"] = {
            "spells": [],
        }

    new_items.append(new_item)

target_collection.insert_many(new_items)
