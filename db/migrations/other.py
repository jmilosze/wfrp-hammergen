import os
import sys

from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

print(f"Are you sure you want to run this migration in {MONGO_URI}?")
x = input()
if x != "yes":
    sys.exit()

db = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)
collection = db.other

generation_props = {'name': 'generation_props', 'test_prop': 'test_val'}
collection.find_one_and_replace({'name': 'generation_props'}, generation_props, upsert=True)
