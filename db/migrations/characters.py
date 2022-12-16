from pymongo import MongoClient
import pickle

PSWD = ''
SOURCE_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'
TARGET_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'

s_client = MongoClient(SOURCE_DB, 27017)
t_client = MongoClient(TARGET_DB, 27017)

s_collection = s_client.Warhammer.Characters
t_collection = t_client.hammergen.character

with open('translation_table.pkl', 'rb') as file:
    translation_table = pickle.load(file)

s_characters = s_collection.find()
for s_character in s_characters:
    if not s_character.get('OwnerId'):
        owner_id = 'admin'
    else:
        try:
            owner_id = translation_table[str(s_character['OwnerId'])]
        except:
            print('Skipping orphaned character', s_character['Name'])

    new_character = {
        '_id': s_character['_id'],
        'owner_id': owner_id,
        'name': s_character['Name'],
        'description': s_character.get('Description', ''),
        'notes': s_character.get('Notes', ''),
        'equipped_items': [{'id': x['_id'], 'number': x['Number']} for x in s_character['EquippedItems']],
        'carried_items': [{'id': x['_id'], 'number': x['Number']} for x in s_character['CarriedItems']],
        'stored_items': [{'id': x['_id'], 'number': x['Number']} for x in s_character['PossessionsAndOwnedItems']],
        'skills': [{'id': x['_id'], 'number': x['Number']} for x in s_character.get('Skills', [])],
        'talents': [{'id': x['_id'], 'number': x['Number']} for x in s_character.get('Talents', [])],
        'species': s_character['Species'],
        'career_path': [{'id': x['_id'], 'level': x['Number']} for x in s_character.get('CareerPath', [])],
        'fate': s_character['FateAndResilience']['Fate'],
        'fortune': s_character['FateAndResilience']['Fortune'],
        'resilience': s_character['FateAndResilience']['Resilience'],
        'resolve': s_character['FateAndResilience']['Resolve'],
        'current_exp': s_character['Experience']['Current'],
        'spent_exp': s_character['Experience']['Spent'],
        'status': s_character['StatusTier'],
        'standing': s_character['Standing'],
        'brass': s_character['Wealth'] % 12,
        'silver': (s_character['Wealth'] // 12) % 20,
        'gold': s_character['Wealth'] // 240,
        'base_attributes': s_character['BaseAttributes'],
        'attribute_advances': s_character['AttributeAdvances'],
        'career': {'id': s_character['Career']['_id'], 'level': s_character['Career']['Number'] + 1}
    }
    t_collection.find_one_and_replace({'_id': s_character['_id']}, new_character, upsert=True)
