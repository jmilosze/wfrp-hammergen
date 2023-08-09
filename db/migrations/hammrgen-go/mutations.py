import os

from pymongo import MongoClient


def migrate(source_db, target_db):
    source_collection = source_db["mutation"]
    target_collection = target_db["mutation"]

    new_mutations = []
    for mutation in source_collection.find():
        new_mutations.append(
            {
                "_id": mutation["_id"],
                "ownerid": mutation["owner_id"],
                "object": {
                    "name": mutation["name"],
                    "description": mutation["description"],
                    "type": mutation["type"],
                    "modifiers": {
                        "size": mutation["modifiers"]["size"],
                        "movement": mutation["modifiers"]["movement"],
                        "attributes": {
                            "ag": mutation["modifiers"]["attributes"]["Ag"],
                            "bs": mutation["modifiers"]["attributes"]["BS"],
                            "dex": mutation["modifiers"]["attributes"]["Dex"],
                            "fel": mutation["modifiers"]["attributes"]["Fel"],
                            "i": mutation["modifiers"]["attributes"]["I"],
                            "int": mutation["modifiers"]["attributes"]["Int"],
                            "s": mutation["modifiers"]["attributes"]["S"],
                            "t": mutation["modifiers"]["attributes"]["T"],
                            "wp": mutation["modifiers"]["attributes"]["WP"],
                            "ws": mutation["modifiers"]["attributes"]["WS"],
                        },
                    },
                    "shared": mutation["shared"],
                    "source": mutation["source"],
                },
            }
        )

    target_collection.drop()
    target_collection.insert_many(new_mutations)


if __name__ == "__main__":
    MONGO_URI = os.environ["MONGO_URI"]
    SOURCE_DB_NAME = os.environ["DB_NAME"]
    TARGET_DB_NAME = f"{SOURCE_DB_NAME}-go"

    SOURCE_DB = MongoClient(MONGO_URI, 27017).get_database(name=SOURCE_DB_NAME)
    TARGET_DB = MongoClient(MONGO_URI, 27017).get_database(name=TARGET_DB_NAME)

    migrate(SOURCE_DB, TARGET_DB)
