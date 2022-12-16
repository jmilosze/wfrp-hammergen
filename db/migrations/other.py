from pymongo import MongoClient

PSWD = ''
DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'

client = MongoClient(DB, 27017)
collection = client.hammergen.other

generation_props = {'name': 'generation_props', 'test_prop': 'test_val'}
collection.find_one_and_replace({'name': 'generation_props'}, generation_props, upsert=True)
