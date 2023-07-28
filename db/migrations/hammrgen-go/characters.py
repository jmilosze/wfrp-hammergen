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

source_collection = source_db["character"]
target_collection = target_db["character"]

new_characters = []
for character in source_collection.find():
    new_characters.append(
        {
            "_id": character["_id"],
            "ownerid": character["owner_id"],
            "object": {
                "name": character["name"],
                "description": character["description"],
                "notes": character["notes"],
                "equippeditems": character["equipped_items"],
                "carrieditems": character["carried_items"],
                "storeditems": character["stored_items"],
                "skills": character["skills"],
                "talents": character["talents"],
                "species": character["species"],
                "baseattributes": {
                    "ws": character["base_attributes"]["WS"],
                    "bs": character["base_attributes"]["BS"],
                    "s": character["base_attributes"]["S"],
                    "t": character["base_attributes"]["T"],
                    "i": character["base_attributes"]["I"],
                    "ag": character["base_attributes"]["Ag"],
                    "dex": character["base_attributes"]["Dex"],
                    "int": character["base_attributes"]["Int"],
                    "wp": character["base_attributes"]["WP"],
                    "fel": character["base_attributes"]["Fel"],
                },
                "attributeadvances": {
                    "ws": character["attribute_advances"]["WS"],
                    "bs": character["attribute_advances"]["BS"],
                    "s": character["attribute_advances"]["S"],
                    "t": character["attribute_advances"]["T"],
                    "i": character["attribute_advances"]["I"],
                    "ag": character["attribute_advances"]["Ag"],
                    "dex": character["attribute_advances"]["Dex"],
                    "int": character["attribute_advances"]["Int"],
                    "wp": character["attribute_advances"]["WP"],
                    "fel": character["attribute_advances"]["Fel"],
                },
                "careerpath": [{"id": x["id"], "number": x["level"]} for x in character["career_path"]],
                "career": {"id": character["career"]["id"], "number": character["career"]["level"]},
                "fate": character["fate"],
                "fortune": character["fortune"],
                "resilience": character["resilience"],
                "resolve": character["resolve"],
                "currentexp": character["current_exp"],
                "spentexp": character["spent_exp"],
                "status": character["status"],
                "standing": character["standing"],
                "brass": character["brass"],
                "silver": character["silver"],
                "gold": character["gold"],
                "spells": character["spells"],
                "sin": character["sin"],
                "corruption": character["corruption"],
                "mutations": character["mutations"],
                "shared": character["shared"],
            },
        }
    )

target_collection.insert_many(new_characters)
