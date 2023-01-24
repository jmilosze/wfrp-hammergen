import os
import re

from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

db = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)
collection = db.spell

page_ref_pattern = re.compile(r"See page (\d+).")

spells = collection.find({"owner_id": "admin"})
for spell in spells:
    if spell["name"].startswith("Blessing of"):
        desc = spell["description"]
        new_desc = desc + " (Rulebook p. 221)"
        collection.find_one_and_update({"_id": spell["_id"]}, {"$set": {"description": new_desc}})
