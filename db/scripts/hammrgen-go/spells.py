import os

from pymongo import MongoClient


def migrate(source_db, target_db):
    source_collection = source_db["spell"]
    target_collection = target_db["spell"]

    new_spells = []
    for spell in source_collection.find():
        new_spells.append(
            {
                "_id": spell["_id"],
                "ownerid": spell["owner_id"],
                "object": {
                    "name": spell["name"],
                    "description": spell["description"],
                    "cn": spell["cn"],
                    "range": spell["range"],
                    "target": spell["target"],
                    "duration": spell["duration"],
                    "shared": spell["shared"],
                    "source": spell["source"],
                },
            }
        )

    target_collection.drop()
    target_collection.insert_many(new_spells)


if __name__ == "__main__":
    MONGO_URI = os.environ["MONGO_URI"]
    SOURCE_DB_NAME = os.environ["DB_NAME"]
    TARGET_DB_NAME = f"{SOURCE_DB_NAME}-go"

    SOURCE_DB = MongoClient(MONGO_URI, 27017).get_database(name=SOURCE_DB_NAME)
    TARGET_DB = MongoClient(MONGO_URI, 27017).get_database(name=TARGET_DB_NAME)

    migrate(SOURCE_DB, TARGET_DB)
