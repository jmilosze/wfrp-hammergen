from pymongo import MongoClient
import pickle

PSWD = ''
SOURCE_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'
TARGET_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'

s_client = MongoClient(SOURCE_DB, 27017)
t_client = MongoClient(TARGET_DB, 27017)

s_collection = s_client.Warhammer.Skills
t_collection = t_client.hammergen.skill

with open('translation_table.pkl', 'rb') as file:
    translation_table = pickle.load(file)

s_skills = s_collection.find()
for s_skill in s_skills:
    if not s_skill.get('OwnerId'):
        owner_id = 'admin'
    else:
        try:
            owner_id = translation_table[str(s_skill['OwnerId'])]
        except:
            print('Skipping orphaned skill', s_skill['Name'])

    new_skill = {
        '_id': s_skill['_id'],
        'owner_id': owner_id,
        'name': s_skill['Name'],
        'description': s_skill.get('Description', ''),
        'attribute': s_skill['Attribute'],
        'type': s_skill['Type'],
        'is_group': s_skill['CanSpecialize'],
        'display_zero': s_skill['DisplayWithRankZero'],
        'group': s_skill['BelongsToGroup'] if s_skill.get('BelongsToGroup') else []
    }
    t_collection.find_one_and_replace({'_id': s_skill['_id']}, new_skill, upsert=True)
