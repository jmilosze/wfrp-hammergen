import os
from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

DB = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)

def find_talents_in_characters(old_id, new_id, char_ids=[]):
    chars = DB["character"].find()
    for char in chars:
        replace = False
        talents = char["object"]["talents"]
        for talent in talents:
            if talent["id"] == old_id:
                replace = True
                talent["id"] = new_id
                break
        if replace and (len(char_ids) == 0 or str(char["_id"]) in char_ids):
            # DB["character"].find_one_and_update({"_id": char["_id"]}, {"$set": {"object.talents": talents}})
            print(f"replacing in: {char["object"]["name"]}")


if __name__ == "__main__":
    find_talents_in_characters("6443df40299189654234bd02", "63b4a3ff76bd2da2010c5f76")
