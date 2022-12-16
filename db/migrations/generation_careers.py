import enum
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
collection_career = db.career
collection_item = db.item

career_names = [
    "Apothecary",  # 01
    "Engineer",  # 02
    "Lawyer",  # 03
    "Nun",  # 04
    "Physician",  # 05
    "Priest",  # 06
    "Scholar",  # 07
    "Wizard",  # 08
    "Agitator",  # 09
    "Artisan",  # 10
    "Beggar",  # 11
    "Investigator",  # 12
    "Merchant",  # 13
    "Rat Catcher",  # 14
    "Townsman",  # 15
    "Watchman",  # 16
    "Advisor",  # 17
    "Artist",  # 18
    "Duellist",  # 19
    "Envoy",  # 20
    "Noble",  # 21
    "Servant",  # 22
    "Spy",  # 23
    "Warden",  # 24
    "Bailiff",  # 25
    "Hedge Witch",  # 26
    "Herbalist",  # 27
    "Hunter",  # 28
    "Miner",  # 29
    "Mystic",  # 30
    "Scout",  # 31
    "Villager",  # 32
    "Bounty Hunter",  # 33
    "Ghost Strider",  # 34 archives of the empire vol 1
    "Coachman",  # 35
    "Entertainer",  # 36
    "Flagellant",  # 37
    "Messenger",  # 38
    "Karak Ranger",  # 39 archives of the empire vol 1
    "Pedlar",  # 40
    "Road Warden",  # 41
    "Fieldwarden",  # 42 archives of the empire vol 1
    "Witch Hunter",  # 43
    "Boatman",  # 44
    "Huffer",  # 45
    "Riverwarden",  # 46
    "Riverwoman",  # 47
    "Seaman",  # 48
    "Smuggler",  # 49
    "Stevedore",  # 50
    "Wrecker",  # 51
    "Bawd",  # 52
    "Charlatan",  # 53
    "Fence",  # 54
    "Grave Robber",  # 55
    "Outlaw",  # 56
    "Racketeer",  # 57
    "Thief",  # 58
    "Witch",  # 59
    "Cavalryman",  # 60
    "Guard",  # 61
    "Knight",  # 62
    "Pit Fighter",  # 63
    "Protagonist",  # 64
    "Soldier",  # 65
    "Badger Rider",  # 66 archives of the empire vol 1
    "Slayer",  # 67
    "Warrior Priest",  # 68
]

cids = []

careers = list(collection_career.find({"owner_id": "admin"}))
for career_name in career_names:
    career_id = None
    for career in careers:
        if career["name"] == career_name:
            career_id = str(career["_id"])
            break
    if career_id:
        cids.append(career_id)
    else:
        raise Exception(f"Career {career_name} not found!")

species_careers = {
    "human": [
        (1, 10),
        (11, 20),
        (21, 30),
        (31, 50),
        (51, 60),
        (61, 110),
        (111, 130),
        (131, 140),
        (141, 150),
        (151, 170),
        (171, 190),
        (191, 200),
        (201, 210),
        (211, 230),
        (231, 260),
        (261, 270),
        (271, 280),
        (281, 290),
        (291, 300),
        (301, 310),
        (311, 320),
        (321, 350),
        (351, 360),
        (361, 370),
        (371, 380),
        (381, 390),
        (391, 400),
        (401, 420),
        (421, 430),
        (431, 440),
        (441, 450),
        (451, 500),
        (501, 510),
        "-",
        (511, 520),
        (521, 540),
        (541, 560),
        (561, 570),
        "-",
        (571, 580),
        (581, 590),
        "-",
        (591, 600),
        (601, 620),
        (621, 630),
        (631, 650),
        (651, 680),
        (681, 700),
        (701, 710),
        (711, 730),
        (731, 740),
        (741, 760),
        (761, 770),
        (771, 780),
        (781, 790),
        (791, 830),
        (831, 840),
        (841, 870),
        (871, 880),
        (881, 900),
        (901, 920),
        (921, 930),
        (931, 940),
        (941, 950),
        (951, 990),
        "-",
        "-",
        (991, 1000),
    ],
    "dwarf": [
        (1, 10),
        (11, 40),
        (41, 60),
        "-",
        (61, 70),
        "-",
        (71, 90),
        "-",
        (91, 110),
        (111, 170),
        (171, 180),
        (181, 200),
        (201, 240),
        (241, 250),
        (251, 310),
        (311, 340),
        (341, 360),
        (361, 370),
        (371, 380),
        (381, 400),
        (401, 410),
        (411, 420),
        (421, 430),
        (431, 450),
        (451, 470),
        "-",
        "-",
        (471, 490),
        (491, 540),
        "-",
        (541, 550),
        (551, 560),
        (561, 600),
        "-",
        (601, 610),
        (611, 630),
        "-",
        (631, 640),
        (641, 650),
        (651, 670),
        "-",
        "-",
        "",
        (671, 690),
        (691, 700),
        "-",
        (701, 720),
        (721, 730),
        (731, 750),
        (751, 770),
        (771, 780),
        "-",
        "-",
        (781, 790),
        "-",
        (791, 820),
        (821, 830),
        (831, 840),
        "-",
        "-",
        (841, 870),
        "-",
        (871, 900),
        (901, 930),
        (931, 960),
        "-",
        (961, 1000),
        "-",
    ],
    "halfling": [
        (1, 10),
        (11, 20),
        (21, 40),
        "-",
        (41, 60),
        "-",
        (61, 80),
        "-",
        (81, 100),
        (101, 150),
        (151, 190),
        (191, 210),
        (211, 250),
        (251, 280),
        (281, 310),
        (311, 330),
        (331, 340),
        (341, 360),
        "-",
        (361, 370),
        "-",
        (371, 430),
        (431, 440),
        (441, 460),
        (461, 470),
        "-",
        (471, 500),
        (501, 520),
        (521, 530),
        "-",
        (531, 540),
        (541, 570),
        (571, 580),
        "-",
        (581, 600),
        (601, 630),
        "-",
        (631, 650),
        "-",
        (651, 670),
        (671, 675),
        (676, 680),
        "-",
        (681, 690),
        (691, 700),
        (701, 710),
        (711, 740),
        (741, 750),
        (751, 790),
        (791, 820),
        "-",
        (821, 850),
        (851, 860),
        (861, 870),
        (871, 880),
        (881, 890),
        (891, 900),
        (901, 940),
        "-",
        "-",
        (941, 960),
        "-",
        (961, 970),
        "-",
        (971, 985),
        (986, 1000),
        "-",
        "-",
    ],
    "high_elf": [
        (1, 20),
        "-",
        (21, 60),
        "-",
        (61, 80),
        "-",
        (81, 120),
        (121, 160),
        "-",
        (161, 190),
        "-",
        (191, 210),
        (211, 260),
        "-",
        (261, 280),
        (281, 290),
        (291, 310),
        (311, 320),
        (321, 340),
        (341, 370),
        (371, 400),
        "-",
        (401, 430),
        (431, 450),
        "-",
        "-",
        (451, 470),
        (471, 500),
        "-",
        "-",
        (501, 560),
        "-",
        (561, 590),
        "-",
        "-",
        (591, 620),
        "-",
        (621, 630),
        "-",
        "-",
        "-",
        "-",
        "-",
        (631, 640),
        "-",
        "-",
        "-",
        (641, 790),
        (791, 800),
        "-",
        "-",
        (801, 820),
        (821, 850),
        "-",
        "-",
        (851, 880),
        "-",
        "-",
        "-",
        (881, 920),
        (921, 940),
        (941, 950),
        (951, 970),
        (971, 980),
        (981, 1000),
        "-",
        "-",
        "-",
    ],
    "wood_elf": [
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        (1, 10),
        (11, 50),
        "-",
        (51, 100),
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        (101, 140),
        (141, 180),
        "-",
        (181, 250),
        (251, 310),
        "-",
        (311, 350),
        "-",
        "-",
        "-",
        (351, 420),
        (421, 520),
        "-",
        (521, 570),
        (571, 680),
        "-",
        (681, 690),
        (691, 700),
        "-",
        (701, 750),
        "-",
        (751, 780),
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        (781, 790),
        "-",
        "-",
        "-",
        "-",
        (791, 850),
        "-",
        "-",
        "-",
        (851, 900),
        (901, 920),
        (921, 940),
        (941, 960),
        "-",
        (961, 1000),
        "-",
        "-",
        "-",
    ],
    "gnome": [
        (1, 10),
        "-",
        (11, 20),
        "-",
        (21, 40),
        (41, 50),
        (51, 70),
        (71, 140),
        (141, 150),
        (151, 170),
        (171, 180),
        (181, 190),
        (191, 210),
        (211, 220),
        (221, 280),
        (281, 290),
        (291, 300),
        (301, 310),
        "-",
        (311, 320),
        (321, 330),
        (331, 350),
        (351, 400),
        (401, 420),
        (421, 430),
        "-",
        (431, 440),
        (441, 460),
        (461, 540),
        "-",
        (541, 580),
        (581, 620),
        (621, 630),
        "-",
        "-",
        (631, 680),
        "-",
        (681, 690),
        "-",
        (691, 750),
        "-",
        "-",
        "-",
        (751, 760),
        "-",
        "-",
        (761, 800),
        "-",
        (801, 830),
        "-",
        "-",
        (831, 850),
        (851, 900),
        (901, 910),
        "-",
        (911, 920),
        (921, 940),
        (941, 970),
        "-",
        "-",
        (971, 980),
        "-",
        "-",
        "-",
        (981, 990),
        "-",
        "-",
        (991, 1000),
    ],
}

species_num = {
    "human": "0",
    "halfling": "1",
    "dwarf": "2",
    "high_elf": "3",
    "wood_elf": "4",
    "gnome": "5",
}

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

item_names = [
    "Clothing",
    "Dagger",
    "Pouch",
    "Sling Bag",
    "Writing Kit",
    "Parchment",
    "Cloak",
    "Hat",
    "Lunch",
    "Fine Clothing",
    "Tweezers",
    "Ear Pick",
    "Comb",
    "Rations - 1 day",
    "Backpack",
    "Tinderbox",
    "Blanket",
    "Flask of Spirits",
    "Candle",
    "Match",
    "Hood",
    "Mask",
    "Hand Weapon",
]

iids = {}
all_items = list(collection_item.find({"owner_id": "admin"}))
for item_name in item_names:
    item_id = None
    for item in all_items:
        if item["name"] == item_name and item["owner_id"] == "admin":
            item_id = str(item["_id"])
            break
    if item_id:
        iids[item_name] = item_id
    else:
        raise Exception(f"Item {item_name} not found!")


class CareerCass(enum.IntEnum):
    ACADEMIC = 0
    BURGHERS = 1
    COURTIER = 2
    PEASANT = 3
    RANGER = 4
    RIVERFOLK = 5
    ROGUE = 6
    WARRIOR = 7


class_items = {
    str(CareerCass.ACADEMIC.value): {
        "equipped": [
            {"id": iids["Clothing"], "number": 1},
            {"id": iids["Dagger"], "number": 1},
            {"id": iids["Sling Bag"], "number": 1},
        ],
        "carried": [
            {"id": iids["Pouch"], "number": 1},
            {"id": iids["Writing Kit"], "number": 1},
            {"id": iids["Parchment"], "number": "1d10"},
        ],
    },
    str(CareerCass.BURGHERS.value): {
        "equipped": [
            {"id": iids["Cloak"], "number": 1},
            {"id": iids["Clothing"], "number": 1},
            {"id": iids["Dagger"], "number": 1},
            {"id": iids["Hat"], "number": 1},
            {"id": iids["Sling Bag"], "number": 1},
            {"id": iids["Pouch"], "number": 1},
        ],
        "carried": [{"id": iids["Lunch"], "number": 1}],
    },
    str(CareerCass.COURTIER.value): {
        "equipped": [
            {"id": iids["Dagger"], "number": 1},
            {"id": iids["Fine Clothing"], "number": 1},
        ],
        "carried": [
            {"id": iids["Pouch"], "number": 1},
            {"id": iids["Tweezers"], "number": 1},
            {"id": iids["Ear Pick"], "number": 1},
            {"id": iids["Comb"], "number": 1},
        ],
    },
    str(CareerCass.PEASANT.value): {
        "equipped": [
            {"id": iids["Cloak"], "number": 1},
            {"id": iids["Clothing"], "number": 1},
            {"id": iids["Dagger"], "number": 1},
            {"id": iids["Sling Bag"], "number": 1},
            {"id": iids["Pouch"], "number": 1},
        ],
        "carried": [{"id": iids["Rations - 1 day"], "number": 1}],
    },
    str(CareerCass.RANGER.value): {
        "equipped": [
            {"id": iids["Cloak"], "number": 1},
            {"id": iids["Clothing"], "number": 1},
            {"id": iids["Dagger"], "number": 1},
            {"id": iids["Backpack"], "number": 1},
            {"id": iids["Pouch"], "number": 1},
        ],
        "carried": [
            {"id": iids["Tinderbox"], "number": 1},
            {"id": iids["Blanket"], "number": 1},
            {"id": iids["Rations - 1 day"], "number": 1},
        ],
    },
    str(CareerCass.RIVERFOLK.value): {
        "equipped": [
            {"id": iids["Cloak"], "number": 1},
            {"id": iids["Clothing"], "number": 1},
            {"id": iids["Dagger"], "number": 1},
            {"id": iids["Sling Bag"], "number": 1},
            {"id": iids["Pouch"], "number": 1},
        ],
        "carried": [{"id": iids["Flask of Spirits"], "number": 1}],
    },
    str(CareerCass.ROGUE.value): {
        "equipped": [
            {"id": iids["Cloak"], "number": 1},
            {"id": iids["Clothing"], "number": 1},
            {"id": iids["Dagger"], "number": 1},
            {"id": iids["Sling Bag"], "number": 1},
            {"id": [iids["Hood"], iids["Mask"]], "number": 1},
            {"id": iids["Pouch"], "number": 1},
        ],
        "carried": [
            {"id": iids["Candle"], "number": 2},
            {"id": iids["Match"], "number": "1d10"},
        ],
    },
    str(CareerCass.WARRIOR.value): {
        "equipped": [
            {"id": iids["Clothing"], "number": 1},
            {"id": iids["Hand Weapon"], "number": 1},
            {"id": iids["Dagger"], "number": 1},
            {"id": iids["Pouch"], "number": 1},
        ],
        "carried": [],
    },
}

collection.update_one({"name": "generation_props"}, {"$set": {"career_gen_table": career_gen_table}})
collection.update_one({"name": "generation_props"}, {"$set": {"class_items": class_items}})
