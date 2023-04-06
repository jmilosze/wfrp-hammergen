import os
from pymongo import MongoClient
import re

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


if __name__ == "__main__":
    find_in_items("5f628c29bec9ed3804581756")
