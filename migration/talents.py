from pymongo import MongoClient
import pickle

PSWD = ''
SOURCE_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'
TARGET_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'

s_client = MongoClient(SOURCE_DB, 27017)
t_client = MongoClient(TARGET_DB, 27017)

s_collection = s_client.Warhammer.Talents
t_collection = t_client.hammergen.talent

with open('translation_table.pkl', 'rb') as file:
    translation_table = pickle.load(file)

s_talents = s_collection.find()
for s_talent in s_talents:
    if not s_talent.get('OwnerId'):
        owner_id = 'admin'
    else:
        try:
            owner_id = translation_table[str(s_talent['OwnerId'])]
        except:
            print('Skipping orphaned talent', s_talent['Name'])

    new_talent = {
        '_id': s_talent['_id'],
        'owner_id': owner_id,
        'name': s_talent['Name'],
        'description': s_talent.get('Description', ''),
        'tests': s_talent['Tests'] if s_talent.get('Tests') else '',
        'max_rank': s_talent['MaxRank'],
        'max_rank_att': s_talent['MaxRankBonus'],
        'is_group': s_talent['CanSpecialize'],
        'group': s_talent['BelongsToGroup'] if s_talent.get('BelongsToGroup') else []
    }
    t_collection.find_one_and_replace({'_id': s_talent['_id']}, new_talent, upsert=True)
