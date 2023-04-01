import os
from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

COLLECTIONS = ["property", "item", "spell", "mutation", "skill", "talent", "career"]

db = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)

FIELDS = {"admin": {"source": {}}, "user": {"source": {"0": ""}}}


def add_field(collection, fields):
    print(f"Updating {collection}")
    items = db[collection].find()
    for item in items:
        if item["owner_id"] == "admin":
            new_fields = fields["admin"]
        else:
            new_fields = fields["user"]
        db[collection].find_one_and_update({"_id": item["_id"]}, {"$set": {k: v for k, v in new_fields.items()}})


if __name__ == "__main__":
    for COLLECTION in COLLECTIONS:
        add_field(COLLECTION, FIELDS)
