from pymongo import MongoClient
import pickle

PSWD = ''
SOURCE_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'
TARGET_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'

s_client = MongoClient(SOURCE_DB, 27017)
t_client = MongoClient(TARGET_DB, 27017)

s_collection = s_client.Warhammer.Items
t_collection = t_client.hammergen.item

with open('translation_table.pkl', 'rb') as file:
    translation_table = pickle.load(file)

s_items = s_collection.find()
for s_item in s_items:
    if not s_item.get('OwnerId'):
        owner_id = 'admin'
    else:
        try:
            owner_id = translation_table[str(s_item['OwnerId'])]
        except:
            print('Skipping orphaned item', s_item['Name'])

    stats = {}
    properties = []

    enc = float(s_item['Encumbrance']) if s_item['Encumbrance'] < 100 else 0.0

    if s_item['ItemType'] == 0:
        stats['type'] = 0
        stats['hands'] = s_item.get('MeleeHands', 0) + 1
        stats['dmg'] = s_item.get('MeleeDamage', 0)
        stats['dmg_sb_mult'] = s_item.get('MeleeDamageBonus', 0)
        stats['reach'] = s_item.get('MeleeReach', 0)
        stats['group'] = s_item.get('MeleeGroup', 0)
        properties += s_item.get('MeleeProperties', [])

    elif s_item['ItemType'] == 1:
        stats['type'] = 1
        stats['hands'] = s_item.get('RangedHands', 0) + 1
        stats['dmg'] = s_item.get('RangedDamage', 0)
        stats['dmg_sb_mult'] = s_item.get('RangedDamageBonus', 0)
        stats['rng'] = s_item.get('RangedRange', 0)
        stats['rng_sb_mult'] = s_item.get('RangedRangeBonus', 0)
        stats['group'] = s_item.get('RangedGroup', 0)
        properties += s_item.get('RangedProperties', [])

    elif s_item['ItemType'] == 2:
        stats['type'] = 2
        stats['dmg'] = s_item.get('AmmunitionDamage', 0)
        stats['rng'] = s_item.get('AmmunitionRangeBonus', 0)
        stats['rng_mult'] = s_item.get('AmmunitionRangeMultiplier', 0)
        stats['group'] = s_item.get('AmmunitionGroup', 0)
        properties += s_item.get('AmmunitionProperties', [])

    elif s_item['ItemType'] == 3:
        stats['type'] = 3
        stats['points'] = s_item.get('ArmorPoints', 0)
        stats['location'] = s_item.get('ArmorLocation', [0])
        stats['group'] = s_item.get('ArmorGroup', 0)
        properties += s_item.get('ArmorProperties', [])

    elif s_item['ItemType'] == 4:
        stats['type'] = 4
        stats['capacity'] = s_item.get('ContainerCarries', 1)
        properties += s_item.get('ContainerProperties', [])

    else:
        stats['type'] = 5
        properties += s_item.get('OtherProperties', [])
        if s_item['ItemType'] == 6:
            stats['carry_type'] = {'carriable': False, 'wearable': False}
            enc = 0.0
        else:
            stats['carry_type'] = {'carriable': True, 'wearable': s_item['Equippable']}

    new_item = {
        '_id': s_item['_id'],
        'owner_id': owner_id,
        'name': s_item['Name'],
        'price': float(s_item.get('Price', 0)),
        'availability': s_item.get('Availability', 3),
        'enc': enc,
        'description': s_item.get('Description', ''),
        'properties': properties,
        'stats': stats
    }
    t_collection.find_one_and_replace({'_id': s_item['_id']}, new_item, upsert=True)
