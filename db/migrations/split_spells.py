import os

from pymongo import MongoClient


def split_spells(db):
    spells_collection = db["spell"]
    prayers_collection = db["prayer"]

    spells = []
    prayers = []
    for spell in spells_collection.find():
        if spell["object"]["cn"] == -1:
            del spell["object"]["cn"]
            prayers.append(spell)
        else:
            spells.append(spell)

    spells_collection.drop()
    spells_collection.insert_many(spells)

    prayers_collection.drop()
    prayers_collection.insert_many(prayers)


if __name__ == "__main__":
    MONGO_URI = os.environ["MONGO_URI"]
    DB_NAME = os.environ["DB_NAME"]

    DB = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)

    split_spells(DB)

