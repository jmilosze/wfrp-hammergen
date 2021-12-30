from pymongo import MongoClient
import pickle

PSWD = ''
SOURCE_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'
TARGET_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'

s_client = MongoClient(SOURCE_DB, 27017)
t_client = MongoClient(TARGET_DB, 27017)

s_collection = s_client.Warhammer.ItemProperties
t_collection = t_client.hammergen.property

with open('translation_table.pkl', 'rb') as file:
    translation_table = pickle.load(file)

s_properties = s_collection.find()
for s_property in s_properties:
    if not s_property.get('OwnerId'):
        owner_id = 'admin'
    else:
        try:
            owner_id = translation_table[str(s_property['OwnerId'])]
        except:
            print('Skipping orphaned property', s_property['Name'])

    id = s_property['_id']
    name = s_property['Name']
    applicable_to = s_property['ApplicableTo']
    type = s_property['Type']
    description = s_property.get('Description', '')
    t_collection.find_one_and_replace({'_id': id},
                                      {'_id': id, 'name': name, 'applicable_to': applicable_to, 'type': type,
                                       'description': description, 'owner_id': owner_id}, upsert=True)
