import os
from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

DB = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)


def find_in_items(id):
    equipped = []
    carried = []
    stored = []
    chars = DB["character"].find()
    for char in chars:
        for item in char["equipped_items"]:
            if item["id"] == id:
                equipped.append(char["name"])
                break
        for item in char["carried_items"]:
            if item["id"] == id:
                carried.append(char["name"])
                break

        for item in char["stored_items"]:
            if item["id"] == id:
                stored.append(char["name"])
                break

    print(f"characters with equipped: {equipped}")
    print(f"characters with carried: {carried}")
    print(f"characters with stored: {stored}")


def find_in_skills(id):
    used = []
    chars = DB["character"].find()
    for char in chars:
        for skill in char["skills"]:
            if skill["id"] == id:
                used.append(char["name"])
                break
    print(f"characters with skill: {used}")


def check_characters():
    not_converted = []
    chars = DB["character"].find()
    for char in chars:
        if not isinstance(char["species"], str):
            not_converted.append(char["name"])

    print(f"not converted characters: {not_converted}")


def find_in_spells(id):
    spells = []
    chars = DB["character"].find()
    for char in chars:
        for item in char["object"]["spells"]:
            if item == id:
                spells.append(char["object"]["name"])
                break

    print(f"characters with spell: {spells}")


if __name__ == "__main__":
    find_in_spells("6649b99f49960d0001d12df4")
