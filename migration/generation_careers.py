import enum

from pymongo import MongoClient

PSWD = ''
DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'

client = MongoClient(DB, 27017)
collection = client.hammergen.other
collection_career = client.hammergen.career
collection_item = client.hammergen.item

career_names = ['Apothecary', 'Engineer', 'Lawyer', 'Nun', 'Physician', 'Priest', 'Scholar', 'Wizard',
                'Agitator', 'Artisan', 'Beggar', 'Investigator', 'Merchant', 'Rat Catcher', 'Townsman', 'Watchman',
                'Advisor', 'Artist', 'Duellist', 'Envoy', 'Noble', 'Servant', 'Spy', 'Warden',
                'Bailiff', 'Hedge Witch', 'Herbalist', 'Hunter', 'Miner', 'Mystic', 'Scout', 'Villager',
                'Bounty Hunter', 'Coachman', 'Entertainer', 'Flagellant', 'Messenger', 'Pedlar', 'Road Warden',
                'Witch Hunter',
                'Boatman', 'Huffer', 'Riverwarden', 'Riverwoman', 'Seaman', 'Smuggler', 'Stevedore', 'Wrecker',
                'Bawd', 'Charlatan', 'Fence', 'Grave Robber', 'Outlaw', 'Racketeer', 'Thief', 'Witch',
                'Cavalryman', 'Guard', 'Knight', 'Pit Fighter', 'Protagonist', 'Soldier', 'Slayer', 'Warrior Priest']

cids = []

careers = list(collection_career.find())
for career_name in career_names:
    career_id = None
    for career in careers:
        if career['name'] == career_name:
            career_id = str(career['_id'])
            break
    if career_id:
        cids.append(career_id)
    else:
        raise Exception('Career not found!')

species_careers = {
    'human': [
        1, 2, 3, (4, 5), 6, (7, 11), (12, 13), 14,
        15, (16, 17), (18, 19), 20, 21, (22, 23), (24, 26), 27,
        28, 29, 30, 31, 32, (33, 35), 36, 37,
        38, 39, 40, (41, 42), 43, 44, 45, (46, 50),
        51, 52, (53, 54), (55, 56), 57, 58, 59, 60,
        (61, 62), 63, (64, 65), (66, 68), (69, 70), 71, (72, 73), 74,
        (75, 76), 77, 78, 79, (80, 83), 84, (85, 87), 88,
        (89, 90), (91, 92), 93, 94, 95, (96, 99), '-', 100
    ],
    'dwarf': [
        1, (2, 4), (5, 6), '-', 7, '-', (8, 9), '-',
        (10, 11), (12, 17), 18, (19, 20), (21, 24), 25, (26, 31), (32, 34),
        (35, 36), 37, 38, (39, 40), 41, 42, 43, (44, 45),
        (46, 47), '-', '-', (48, 49), (50, 54), '-', 55, 56,
        (57, 60), 61, (62, 63), '-', (64, 65), (66, 67), '-', '',
        (68, 69), 70, '-', (71, 72), 73, (74, 75), (76, 77), 78,
        '-', '-', 79, '-', (80, 82), 83, 84, '-',
        '-', (85, 87), '-', (88, 90), (91, 93), (94, 96), (97, 100), '-'
    ],
    'halfling': [
        1, 2, (3, 4), '-', (5, 6), '-', (7, 8), '-',
        (9, 10), (11, 15), (16, 19), (20, 21), (22, 25), (26, 28), (29, 31), (32, 33),
        34, (35, 36), '-', 37, '-', (38, 43), 44, (45, 46),
        47, '-', (48, 50), (51, 52), 53, '-', 54, (55, 57),
        58, (59, 60), (61, 63), '-', (64, 65), (66, 67), 68, '-',
        69, 70, 71, (72, 74), 75, (76, 79), (80, 82), '-',
        (83, 85), 86, 87, 88, 89, 90, (91, 94), '-',
        '-', (95, 96), '-', 97, '-', (98, 100), '-', '-'
    ],
    'high_elf': [
        (1, 2), '-', (3, 6), '-', (7, 8), '-', (9, 12), (13, 16),
        '-', (17, 19), '-', (20, 21), (22, 26), '-', (27, 28), 29,
        (30, 31), 32, (33, 34), (35, 37), (38, 40), '-', (41, 43), (44, 45),
        '-', '-', (46, 47), (48, 50), '-', '-', (51, 56), '-',
        (57, 59), '-', (60, 62), '-', 63, '-', '-', '-',
        64, '-', '-', '-', (65, 79), 80, '-', '-',
        (81, 82), (83, 85), '-', '-', (86, 88), '-', '-', '-',
        (89, 92), (93, 94), 95, (96, 97), 98, (99, 100), '-', '-'
    ],
    'wood_elf': [
        '-', '-', '-', '-', '-', '-', 1, (2, 5),
        '-', (6, 10), '-', '-', '-', '-', '-', '-',
        (11, 14), (15, 18), '-', (19, 25), (26, 31), '-', (32, 35), '-',
        '-', '-', (36, 42), (43, 52), '-', (53, 57), (58, 68), '-',
        (69, 70), '-', (71, 75), '-', (76, 78), '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', 79,
        '-', '-', '-', '-', (80, 85), '-', '-', '-',
        (86, 90), (91, 92), (93, 94), (95, 96), '-', (97, 100), '-', '-'
    ]
}

species_num = {'human': '0', 'halfling': '1', 'dwarf': '2', 'high_elf': '3', 'wood_elf': '4'}

career_gen_table = {}
for species, career_probs in species_careers.items():
    career_gen_table[species_num[species]] = []
    for idx, career_prob in enumerate(career_probs):
        if isinstance(career_prob, int):
            career_gen_table[species_num[species]].append([cids[idx], career_prob, career_prob + 1])
        elif isinstance(career_prob, tuple):
            career_gen_table[species_num[species]].append([cids[idx], career_prob[0], career_prob[1] + 1])
        else:
            pass

item_names = ['Clothing', 'Dagger', 'Pouch', 'Sling Bag', 'Writing Kit', 'Parchment', 'Cloak', 'Hat', 'Lunch',
              'Fine Clothing', 'Tweezers', 'Ear Pick', 'Comb', 'Rations - 1 day', 'Backpack', 'Tinderbox',
              'Blanket', 'Flask of Spirits', 'Candle', 'Match', 'Hood', 'Mask', 'Hand Weapon']

iids = {}
all_items = list(collection_item.find())
for item_name in item_names:
    item_id = None
    for item in all_items:
        if item['name'] == item_name and item['owner_id'] == 'admin':
            item_id = str(item['_id'])
            break
    if item_id:
        iids[item_name] = item_id
    else:
        raise Exception(f'Item {item_name} not found!')


class CareerCass(enum.IntEnum):
    ACADEMIC = 0,
    BURGHERS = 1,
    COURTIER = 2,
    PEASANT = 3,
    RANGER = 4,
    RIVERFOLK = 5,
    ROGUE = 6,
    WARRIOR = 7


class_items = {
    str(CareerCass.ACADEMIC.value): {
        'equipped': [
            {'id': iids['Clothing'], 'number': 1}, {'id': iids['Dagger'], 'number': 1},
            {'id': iids['Sling Bag'], 'number': 1}
        ],
        'carried': [
            {'id': iids['Pouch'], 'number': 1}, {'id': iids['Writing Kit'], 'number': 1},
            {'id': iids['Parchment'], 'number': '1d10'}
        ]
    },
    str(CareerCass.BURGHERS.value): {
        'equipped': [
            {'id': iids['Cloak'], 'number': 1}, {'id': iids['Clothing'], 'number': 1},
            {'id': iids['Dagger'], 'number': 1}, {'id': iids['Hat'], 'number': 1},
            {'id': iids['Sling Bag'], 'number': 1}, {'id': iids['Pouch'], 'number': 1}
        ],
        'carried': [
            {'id': iids['Lunch'], 'number': 1}
        ]
    },
    str(CareerCass.COURTIER.value): {
        'equipped': [
            {'id': iids['Dagger'], 'number': 1}, {'id': iids['Fine Clothing'], 'number': 1}
        ],
        'carried': [
            {'id': iids['Pouch'], 'number': 1}, {'id': iids['Tweezers'], 'number': 1},
            {'id': iids['Ear Pick'], 'number': 1}, {'id': iids['Comb'], 'number': 1}
        ]
    },
    str(CareerCass.PEASANT.value): {
        'equipped': [
            {'id': iids['Cloak'], 'number': 1}, {'id': iids['Clothing'], 'number': 1},
            {'id': iids['Dagger'], 'number': 1}, {'id': iids['Sling Bag'], 'number': 1},
            {'id': iids['Pouch'], 'number': 1}

        ],
        'carried': [
            {'id': iids['Rations - 1 day'], 'number': 1}
        ]
    },
    str(CareerCass.RANGER.value): {
        'equipped': [
            {'id': iids['Cloak'], 'number': 1}, {'id': iids['Clothing'], 'number': 1},
            {'id': iids['Dagger'], 'number': 1}, {'id': iids['Backpack'], 'number': 1},
            {'id': iids['Pouch'], 'number': 1}

        ],
        'carried': [
            {'id': iids['Tinderbox'], 'number': 1},
            {'id': iids['Blanket'], 'number': 1}, {'id': iids['Rations - 1 day'], 'number': 1}
        ]
    },
    str(CareerCass.RIVERFOLK.value): {
        'equipped': [
            {'id': iids['Cloak'], 'number': 1}, {'id': iids['Clothing'], 'number': 1},
            {'id': iids['Dagger'], 'number': 1}, {'id': iids['Sling Bag'], 'number': 1},
            {'id': iids['Pouch'], 'number': 1}
        ],
        'carried': [
            {'id': iids['Flask of Spirits'], 'number': 1}
        ]
    },
    str(CareerCass.ROGUE.value): {
        'equipped': [
            {'id': iids['Cloak'], 'number': 1}, {'id': iids['Clothing'], 'number': 1},
            {'id': iids['Dagger'], 'number': 1}, {'id': iids['Sling Bag'], 'number': 1},
            {'id': [iids['Hood'], iids['Mask']], 'number': 1}, {'id': iids['Pouch'], 'number': 1}

        ],
        'carried': [
            {'id': iids['Candle'], 'number': 2},
            {'id': iids['Match'], 'number': '1d10'}
        ]
    },
    str(CareerCass.WARRIOR.value): {
        'equipped': [
            {'id': iids['Clothing'], 'number': 1}, {'id': iids['Hand Weapon'], 'number': 1},
            {'id': iids['Dagger'], 'number': 1}, {'id': iids['Pouch'], 'number': 1}
        ],
        'carried': [
        ]
    }

}

collection.update_one({'name': 'generation_props'}, {'$set': {'career_gen_table': career_gen_table}})
collection.update_one({'name': 'generation_props'}, {'$set': {'class_items': class_items}})
