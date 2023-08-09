import os

from pymongo import MongoClient
from bson import ObjectId


def migrate(source_db, target_db):
    source_collection = source_db["user"]
    target_collection = target_db["user"]

    new_users = []
    for user in source_collection.find():
        new_users.append(
            {
                "_id": user["_id"],
                "username": user["username"],
                "passwordHash": user["password_hash"],
                "admin": "master_admin" in user["claims"],
                "sharedAccountIds": [ObjectId(x) for x in user["shared_accounts"]],
                "createdOn": user["created_on"],
                "lastAuthOn": user.get("last_auth_on", user["created_on"]),
            }
        )

    target_collection.drop()
    target_collection.insert_many(new_users)


if __name__ == "__main__":
    MONGO_URI = os.environ["MONGO_URI"]
    SOURCE_DB_NAME = os.environ["DB_NAME"]
    TARGET_DB_NAME = f"{SOURCE_DB_NAME}-go"

    SOURCE_DB = MongoClient(MONGO_URI, 27017).get_database(name=SOURCE_DB_NAME)
    TARGET_DB = MongoClient(MONGO_URI, 27017).get_database(name=TARGET_DB_NAME)

    migrate(SOURCE_DB, TARGET_DB)
