import os
from pymongo import MongoClient
import re

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

DB = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)

RE = r"\(([^()]*)\)$"

PATTERNS = [
    {"name": "Rulebook", "value": "1"},
    {"name": "Up in Arms", "value": "6"},
    {"name": "Archives of the Empire Vol III", "value": "5"},
    {"name": "Archives of the Empire Vol II", "value": "4"},
    {"name": "Archives of the Empire Vol I", "value": "3"},
    {"name": "Winds of Magic", "value": "7"},
    {"name": "Windos of Magic", "value": "7"},
]


def to_source(source_string):
    for pattern in PATTERNS:
        if pattern["name"] in source_string:
            return {pattern["value"]: re.sub(pattern["name"], "", source_string).strip()}


def add_source_from_desc(collection):
    print(f"Updating {collection}")
    no_matchees = []
    items = DB[collection].find()
    for item in items:
        if item["owner_id"] == "admin":
            desc = item["description"].strip()
            matches = re.findall(RE, desc)

            # print("-----------------------------------------------------")
            # print(f"desc: {desc}")
            if matches:
                contents = matches[-1]
                sources_txt = [x.strip() for x in contents.split(",")]
                sources = {}
                for source in sources_txt:
                    sources.update(to_source(source))
                new_desc = re.sub(RE, "", desc).strip()
                DB[collection].find_one_and_update(
                    {"_id": item["_id"]}, {"$set": {"source": sources, "description": new_desc}}
                )
                # print(f"sources: {sources_txt}, numerical: {sources}")
                # print(f"new_desc: {new_desc}")
            else:
                # print("No matches")
                no_matchees.append(item["name"])
    print("No matches for", *no_matchees, sep=", ")


def add_source():
    print("Updating mutation")
    items = DB["mutation"].find()
    for item in items:
        if item["owner_id"] == "admin":
            if item["type"] == 0:
                source = {"1": "p. 184"}
            elif item["type"] == 1:
                source = {"1": "p. 185"}
            else:
                print(f"Mutation with unknown type {item['name']}")
                return
            # print(f"Updating mutation {item['name']} with {source}")
            DB["mutation"].find_one_and_update({"_id": item["_id"]}, {"$set": {"source": source}})


if __name__ == "__main__":
    add_source_from_desc("property")
    add_source_from_desc("spell")
    add_source()
