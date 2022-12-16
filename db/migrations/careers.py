from pymongo import MongoClient
import pickle

PSWD = ''
SOURCE_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'
TARGET_DB = f'mongodb+srv://Jacek:{PSWD}0@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'

s_client = MongoClient(SOURCE_DB, 27017)
t_client = MongoClient(TARGET_DB, 27017)

s_collection = s_client.Warhammer.Careers
t_collection = t_client.hammergen.career

with open('translation_table.pkl', 'rb') as file:
    translation_table = pickle.load(file)

s_careers = s_collection.find()
for s_career in s_careers:
    if not s_career.get('OwnerId'):
        owner_id = 'admin'
    else:
        owner_id = translation_table[str(s_career['OwnerId'])]

    new_career = {
        '_id': s_career['_id'],
        'owner_id': owner_id,
        'name': s_career['Name'],
        'class': s_career['Class'],
        'species': s_career['Species'],
        'description': s_career.get('Description', ''),
    }
    for i in range(4):
        items = s_career['Levels'][i]['Items'] if s_career['Levels'][i]['Items'] else ''

        new_career['level_' + str(i + 1)] = {
            'name': s_career['Levels'][i]['Name'],
            'status': s_career['Levels'][i]['StatusTier'],
            'standing': s_career['Levels'][i]['Standing'],
            'attributes': s_career['Levels'][i]['Attributes'],
            'skills': s_career['Levels'][i]['Skills'],
            'talents': s_career['Levels'][i]['Talents'],
            'items': items
        }
    t_collection.find_one_and_replace({'_id': s_career['_id']}, new_career, upsert=True)
