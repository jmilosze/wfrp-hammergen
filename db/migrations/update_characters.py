import os

from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

db = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)
collection = db.character


def new_species(old_species):
    if old_species == 0:
        return "0001"
    if old_species == 1:
        return "0100"
    if old_species == 2:
        return "0200"
    if old_species == 3:
        return "0300"
    if old_species == 4:
        return "0400"
    if old_species == 5:
        return "0500"
    if old_species == 6:
        return "0600"


chars = collection.find()
for char in chars:
    collection.find_one_and_update({"_id": char["_id"]}, {"$set": {"species": new_species(char["species"])}})
