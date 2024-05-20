import os

from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

db = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)
collection = db.talent

# items = collection.find()
# for item in items:
#     collection.find_one_and_update({"_id": item["_id"]}, {"$set": {"modifiers": modifiers}})

result = collection.update_many(
    {},  # This filter matches all documents
    {
        "$set": {"object.modifiers.effects": []}  # Adds 'effects' as an empty array inside 'modifiers'
    }
)

print(f"Documents modified: {result.modified_count}")

