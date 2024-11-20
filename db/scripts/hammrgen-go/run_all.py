import os

from pymongo import MongoClient

import careers
import characters
import generation_careers
import generation_species
import items
import mutations
import properties
import skills
import spells
import talents
import users

if __name__ == "__main__":
    SOURCE_MONGO_URI = os.environ["SOURCE_MONGO_URI"]
    TARGET_MONGO_URI = os.environ["TARGET_MONGO_URI"]
    SOURCE_DB_NAME = os.environ["SOURCE_DB_NAME"]
    TARGET_DB_NAME = os.environ["TARGET_DB_NAME"]

    SOURCE_DB = MongoClient(SOURCE_MONGO_URI, 27017).get_database(name=SOURCE_DB_NAME)
    TARGET_DB = MongoClient(TARGET_MONGO_URI, 27017).get_database(name=TARGET_DB_NAME)

    print("migrating careers")
    careers.migrate(SOURCE_DB, TARGET_DB)
    print("migrating characters")
    characters.migrate(SOURCE_DB, TARGET_DB)
    print("migrating items")
    items.migrate(SOURCE_DB, TARGET_DB)
    print("migrating mutations")
    mutations.migrate(SOURCE_DB, TARGET_DB)
    print("migrating properties")
    properties.migrate(SOURCE_DB, TARGET_DB)
    print("migrating skills")
    skills.migrate(SOURCE_DB, TARGET_DB)
    print("migrating spells")
    spells.migrate(SOURCE_DB, TARGET_DB)
    print("migrating talents")
    talents.migrate(SOURCE_DB, TARGET_DB)
    print("migrating users")
    users.migrate(SOURCE_DB, TARGET_DB)

    print("adding generation_careers")
    generation_careers.generate(TARGET_DB)
    print("adding generation_species")
    generation_species.generate(TARGET_DB)
