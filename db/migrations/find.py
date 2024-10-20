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


def find_property(id):
    properties = []
    items = DB["item"].find()
    for item in items:
        for property in item["object"]["properties"]:
            if property == id:
                properties.append(item["object"]["name"])
                break

    print(f"items with property: {properties}")


def find_talents_in_characters(id):
    used = []
    chars = DB["character"].find()
    for char in chars:
        for talent in char["object"]["talents"]:
            if talent["id"] == id:
                used.append(char["object"]["name"])
                break
    print(f"characters with skill: {used}")


if __name__ == "__main__":
    find_talents_in_characters("63b4a3ff76bd2da2010c5f76")
