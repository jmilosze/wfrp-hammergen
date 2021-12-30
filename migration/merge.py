from pymongo import MongoClient

PSWD = ''
SOURCE_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'
TARGET_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'

s_client = MongoClient(SOURCE_DB, 27017)
t_client = MongoClient(TARGET_DB, 27017)

s_collection = s_client.hammergen.item
t_collection = t_client.test.item

s_items = s_collection.find()
for s_item in s_items:
    t_collection.find_one_and_replace({'_id': s_item['_id']}, s_item, upsert=True)
