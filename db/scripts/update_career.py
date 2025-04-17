import os
from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

db = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)
collection = db.career

# Option 2: Update all career documents in the MongoDB collection
def update_mongodb_collection():
    # Find all career documents and update them
    cursor = db.career.find({})
    for doc in cursor:
        # Update in the database
        collection.update_one(
            {"_id": doc["_id"]},
            {"$set": {
                "object.level1.exists": True,
                "object.level2.exists": True,
                "object.level3.exists": True,
                "object.level4.exists": True,
                "object.level5": {
                    "exists": False,
                    "name": "",
                    "status": 0,
                    "standing": 0,
                    "attributes": [],
                    "skills": [],
                    "talents": [],
                    "items": ""
                }
            }}
        )


        print(f"Updated {doc['object']['name']}")

# Main execution
if __name__ == "__main__":
    # update_single_document()
    update_mongodb_collection()
