import os

from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

db = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)
collection = db.talent

result = collection.update_many(
    {},
    {
        "$set": {"object.attribute2": 0}
    }
)

print(f"Documents modified: {result.modified_count}")

