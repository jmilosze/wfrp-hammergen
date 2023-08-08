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

    careers.migrate(SOURCE_DB, TARGET_DB)
    characters.migrate(SOURCE_DB, TARGET_DB)
    items.migrate(SOURCE_DB, TARGET_DB)
    mutations.migrate(SOURCE_DB, TARGET_DB)
    properties.migrate(SOURCE_DB, TARGET_DB)
    skills.migrate(SOURCE_DB, TARGET_DB)
    spells.migrate(SOURCE_DB, TARGET_DB)
    talents.migrate(SOURCE_DB, TARGET_DB)
    users.migrate(SOURCE_DB, TARGET_DB)

    generation_careers.generate(TARGET_DB)
    generation_species.generate(TARGET_DB)
