import os

from pymongo import MongoClient


def split_spells(db):
    spells_collection = db["spell"]
    prayers_collection = db["prayer"]
    characters_collection = db["character"]

    spells = []
    prayers = []
    spells_ids = []
    prayer_ids = []
    for spell in spells_collection.find():
        if spell["object"]["cn"] == -1:
            del spell["object"]["cn"]
            prayers.append(spell)
            prayer_ids.append(str(spell["_id"]))
        else:
            spells.append(spell)
            spells_ids.append(str(spell["_id"]))

    characters = []
    for character in characters_collection.find():
        new_spells = []
        new_prayers = []

        for old_spell in character["object"]["spells"]:
            if old_spell in spells_ids:
                new_spells.append(old_spell)
            else:
                new_prayers.append(old_spell)

        character["object"]["spells"] = new_spells
        character["object"]["prayers"] = new_prayers
        characters.append(character)

    characters_collection.drop()
    characters_collection.insert_many(characters)

    spells_collection.drop()
    spells_collection.insert_many(spells)

    prayers_collection.drop()
    prayers_collection.insert_many(prayers)


if __name__ == "__main__":
    MONGO_URI = os.environ["MONGO_URI"]
    DB_NAME = os.environ["DB_NAME"]

    DB = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)

    split_spells(DB)
