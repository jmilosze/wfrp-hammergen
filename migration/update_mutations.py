import os

from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

db = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)
collection = db.mutation

modifiers = {
    "size": 0,
    "attributes": {
        "WS": 0,
        "BS": 0,
        "S": 0,
        "T": 0,
        "I": 0,
        "Ag": 0,
        "Dex": 0,
        "Int": 0,
        "WP": 0,
        "Fel": 0,
    },
    "movement": 0,
}

items = collection.find()
for item in items:
    collection.find_one_and_update({"_id": item["_id"]}, {"$set": {"modifiers": modifiers}})
