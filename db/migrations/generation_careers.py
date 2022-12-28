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
        (1, 10),  # Apothecary
        (11, 20),  # Engineer
        (21, 30),  # Lawyer
        (31, 50),  # Nun
        (51, 60),  # Physician
        (61, 110),  # Priest
        (111, 130),  # Scholar
        (131, 140),  # Wizard
        (141, 150),  # Agitator
        (151, 170),  # Artisan"
        (171, 190),  # Beggar
        (191, 200),  # Investigator
        (201, 210),  # Merchant
        (211, 230),  # Rat Catcher
        (231, 260),  # Townsman
        (261, 270),  # Watchman
        (271, 280),  # Advisor
        (281, 290),  # Artist
        (291, 300),  # Duellist
        (301, 310),  # Envoy
        (311, 320),  # Noble
        (321, 350),  # Servant
        (351, 360),  # Spy
        (361, 370),  # Warden
        (371, 380),  # Bailiff
        (381, 390),  # Hedge Witch
        (391, 400),  # Herbalist
        (401, 420),  # Hunter
        (421, 430),  # Miner
        (431, 440),  # Mystic
        (441, 450),  # Scout
        (451, 500),  # Villager
        (501, 510),  # Bounty Hunter
        "-",  # Ghost Strider
        (511, 520),  # Coachman
        (521, 540),  # Entertainer
        (541, 560),  # Flagellant
        (561, 570),  # Messenger
        "-",  # Karak Ranger
        (571, 580),  # Pedlar
        (581, 590),  # Road Warden
        "-",  # Fieldwarden
        (591, 600),  # Witch Hunter
        (601, 620),  # Boatman
        (621, 630),  # Huffer
        (631, 650),  # Riverwarden
        (651, 680),  # Riverwoman
        (681, 700),  # Seaman
        (701, 710),  # Smuggler
        (711, 730),  # Stevedore
        (731, 740),  # Wrecker
        (741, 760),  # Bawd
        (761, 770),  # Charlatan
        (771, 780),  # Fence
        (781, 790),  # Grave Robber
        (791, 830),  # Outlaw
        (831, 840),  # Racketeer
        (841, 870),  # Thief
        (871, 880),  # Witch
        (881, 900),  # Cavalryman
        (901, 920),  # Guard
        (921, 930),  # Knight
        (931, 940),  # Pit Fighter
        (941, 950),  # Protagonist"
        (951, 990),  # Soldier
        "-",  # Badger Rider
        "-",  # Slayer
        (991, 1000),  # Warrior Priest
    ],
    "dwarf": [
        (1, 10),  # Apothecary
        (11, 40),  # Engineer
        (41, 60),  # Lawyer
        "-",  # Nun
        (61, 70),  # Physician
        "-",  # Priest
        (71, 90),  # Scholar
        "-",  # Wizard
        (91, 110),  # Agitator
        (111, 170),  # Artisan"
        (171, 180),  # Beggar
        (181, 200),  # Investigator
        (201, 240),  # Merchant
        (241, 250),  # Rat Catcher
        (251, 310),  # Townsman
        (311, 340),  # Watchman
        (341, 360),  # Advisor
        (361, 370),  # Artist
        (371, 380),  # Duellist
        (381, 400),  # Envoy
        (401, 410),  # Noble
        (411, 420),  # Servant
        (421, 430),  # Spy
        (431, 450),  # Warden
        (451, 470),  # Bailiff
        "-",  # Hedge Witch
        "-",  # Herbalist
        (471, 490),  # Hunter
        (491, 540),  # Miner
        "-",  # Mystic
        (541, 550),  # Scout
        (551, 560),  # Villager
        (561, 600),  # Bounty Hunter
        "-",  # Ghost Strider
        (601, 610),  # Coachman
        (611, 630),  # Entertainer
        "-",  # Flagellant
        (631, 640),  # Messenger
        (641, 650),  # Karak Ranger
        (651, 670),  # Pedlar
        "-",  # Road Warden
        "-",  # Fieldwarden
        "",  # Witch Hunter
        (671, 690),  # Boatman
        (691, 700),  # Huffer
        "-",  # Riverwarden
        (701, 720),  # Riverwoman
        (721, 730),  # Seaman
        (731, 750),  # Smuggler
        (751, 770),  # Stevedore
        (771, 780),  # Wrecker
        "-",  # Bawd
        "-",  # Charlatan
        (781, 790),  # Fence
        "-",  # Grave Robber
        (791, 820),  # Outlaw
        (821, 830),  # Racketeer
        (831, 840),  # Thief
        "-",  # Witch
        "-",  # Cavalryman
        (841, 870),  # Guard
        "-",  # Knight
        (871, 900),  # Pit Fighter
        (901, 930),  # Protagonist"
        (931, 960),  # Soldier
        "-",  # Badger Rider
        (961, 1000),  # Slayer
        "-",  # Warrior Priest
    ],
    "halfling": [
        (1, 10),  # Apothecary
        (11, 20),  # Engineer
        (21, 40),  # Lawyer
        "-",  # Nun
        (41, 60),  # Physician
        "-",  # Priest
        (61, 80),  # Scholar
        "-",  # Wizard
        (81, 100),  # Agitator
        (101, 150),  # Artisan"
        (151, 190),  # Beggar
        (191, 210),  # Investigator
        (211, 250),  # Merchant
        (251, 280),  # Rat Catcher
        (281, 310),  # Townsman
        (311, 330),  # Watchman
        (331, 340),  # Advisor
        (341, 360),  # Artist
        "-",  # Duellist
        (361, 370),  # Envoy
        "-",  # Noble
        (371, 430),  # Servant
        (431, 440),  # Spy
        (441, 460),  # Warden
        (461, 470),  # Bailiff
        "-",  # Hedge Witch
        (471, 500),  # Herbalist
        (501, 520),  # Hunter
        (521, 530),  # Miner
        "-",  # Mystic
        (531, 540),  # Scout
        (541, 570),  # Villager
        (571, 580),  # Bounty Hunter
        "-",  # Ghost Strider
        (581, 600),  # Coachman
        (601, 630),  # Entertainer
        "-",  # Flagellant
        (631, 650),  # Messenger
        "-",  # Karak Ranger
        (651, 670),  # Pedlar
        (671, 675),  # Road Warden
        (676, 680),  # Fieldwarden
        "-",  # Witch Hunter
        (681, 690),  # Boatman
        (691, 700),  # Huffer
        (701, 710),  # Riverwarden
        (711, 740),  # Riverwoman
        (741, 750),  # Seaman
        (751, 790),  # Smuggler
        (791, 820),  # Stevedore
        "-",  # Wrecker
        (821, 850),  # Bawd
        (851, 860),  # Charlatan
        (861, 870),  # Fence
        (871, 880),  # Grave Robber
        (881, 890),  # Outlaw
        (891, 900),  # Racketeer
        (901, 940),  # Thief
        "-",  # Witch
        "-",  # Cavalryman
        (941, 960),  # Guard
        "-",  # Knight
        (961, 970),  # Pit Fighter
        "-",  # Protagonist"
        (971, 985),  # Soldier
        (986, 1000),  # Badger Rider
        "-",  # Slayer
        "-",  # Warrior Priest
    ],
    "high_elf": [
        (1, 20),  # Apothecary
        "-",  # Engineer
        (21, 60),  # Lawyer
        "-",  # Nun
        (61, 80),  # Physician
        "-",  # Priest
        (81, 120),  # Scholar
        (121, 160),  # Wizard
        "-",  # Agitator
        (161, 190),  # Artisan"
        "-",  # Beggar
        (191, 210),  # Investigator
        (211, 260),  # Merchant
        "-",  # Rat Catcher
        (261, 280),  # Townsman
        (281, 290),  # Watchman
        (291, 310),  # Advisor
        (311, 320),  # Artist
        (321, 340),  # Duellist
        (341, 370),  # Envoy
        (371, 400),  # Noble
        "-",  # Servant
        (401, 430),  # Spy
        (431, 450),  # Warden
        "-",  # Bailiff
        "-",  # Hedge Witch
        (451, 470),  # Herbalist
        (471, 500),  # Hunter
        "-",  # Miner
        "-",  # Mystic
        (501, 560),  # Scout
        "-",  # Villager
        (561, 590),  # Bounty Hunter
        "-",  # Ghost Strider
        "-",  # Coachman
        (591, 620),  # Entertainer
        "-",  # Flagellant
        (621, 630),  # Messenger
        "-",  # Karak Ranger
        "-",  # Pedlar
        "-",  # Road Warden
        "-",  # Fieldwarden
        "-",  # Witch Hunter
        (631, 640),  # Boatman
        "-",  # Huffer
        "-",  # Riverwarden
        "-",  # Riverwoman
        (641, 790),  # Seaman
        (791, 800),  # Smuggler
        "-",  # Stevedore
        "-",  # Wrecker
        (801, 820),  # Bawd
        (821, 850),  # Charlatan
        "-",  # Fence
        "-",  # Grave Robber
        (851, 880),  # Outlaw
        "-",  # Racketeer
        "-",  # Thief
        "-",  # Witch
        (881, 920),  # Cavalryman
        (921, 940),  # Guard
        (941, 950),  # Knight
        (951, 970),  # Pit Fighter
        (971, 980),  # Protagonist"
        (981, 1000),  # Soldier
        "-",  # Badger Rider
        "-",  # Slayer
        "-",  # Warrior Priest
    ],
    "wood_elf": [
        "-",  # Apothecary
        "-",  # Engineer
        "-",  # Lawyer
        "-",  # Nun
        "-",  # Physician
        "-",  # Priest
        (1, 10),  # Scholar
        (11, 50),  # Wizard
        "-",  # Agitator
        (51, 100),  # Artisan"
        "-",  # Beggar
        "-",  # Investigator
        "-",  # Merchant
        "-",  # Rat Catcher
        "-",  # Townsman
        "-",  # Watchman
        (101, 140),  # Advisor
        (141, 180),  # Artist
        "-",  # Duellist
        (181, 250),  # Envoy
        (251, 310),  # Noble
        "-",  # Servant
        (311, 350),  # Spy
        "-",  # Warden
        "-",  # Bailiff
        "-",  # Hedge Witch
        (351, 420),  # Herbalist
        (421, 520),  # Hunter
        "-",  # Miner
        (521, 570),  # Mystic
        (571, 680),  # Scout
        "-",  # Villager
        (681, 690),  # Bounty Hunter
        (691, 700),  # Ghost Strider
        "-",  # Coachman
        (701, 750),  # Entertainer
        "-",  # Flagellant
        (751, 780),  # Messenger
        "-",  # Karak Ranger
        "-",  # Pedlar
        "-",  # Road Warden
        "-",  # Fieldwarden
        "-",  # Witch Hunter
        "-",  # Boatman
        "-",  # Huffer
        "-",  # Riverwarden
        "-",  # Riverwoman
        "-",  # Seaman
        "-",  # Smuggler
        "-",  # Stevedore
        (781, 790),  # Wrecker
        "-",  # Bawd
        "-",  # Charlatan
        "-",  # Fence
        "-",  # Grave Robber
        (791, 850),  # Outlaw
        "-",  # Racketeer
        "-",  # Thief
        "-",  # Witch
        (851, 900),  # Cavalryman
        (901, 920),  # Guard
        (921, 940),  # Knight
        (941, 960),  # Pit Fighter
        "-",  # Protagonist"
        (961, 1000),  # Soldier
        "-",  # Badger Rider
        "-",  # Slayer
        "-",  # Warrior Priest
    ],
    "gnome": [
        (1, 10),  # Apothecary
        "-",  # Engineer
        (11, 20),  # Lawyer
        "-",  # Nun
        (21, 40),  # Physician
        (41, 50),  # Priest
        (51, 70),  # Scholar
        (71, 140),  # Wizard
        (141, 150),  # Agitator
        (151, 170),  # Artisan"
        (171, 180),  # Beggar
        (181, 190),  # Investigator
        (191, 210),  # Merchant
        (211, 220),  # Rat Catcher
        (221, 280),  # Townsman
        (281, 290),  # Watchman
        (291, 300),  # Advisor
        (301, 310),  # Artist
        "-",  # Duellist
        (311, 320),  # Envoy
        (321, 330),  # Noble
        (331, 350),  # Servant
        (351, 400),  # Spy
        (401, 420),  # Warden
        (421, 430),  # Bailiff
        "-",  # Hedge Witch
        (431, 440),  # Herbalist
        (441, 460),  # Hunter
        (461, 540),  # Miner
        "-",  # Mystic
        (541, 580),  # Scout
        (581, 620),  # Villager
        (621, 630),  # Bounty Hunter
        "-",  # Ghost Strider
        "-",  # Coachman
        (631, 680),  # Entertainer
        "-",  # Flagellant
        (681, 690),  # Messenger
        "-",  # Karak Ranger
        (691, 750),  # Pedlar
        "-",  # Road Warden
        "-",  # Fieldwarden
        "-",  # Witch Hunter
        (751, 760),  # Boatman
        "-",  # Huffer
        "-",  # Riverwarden
        (761, 800),  # Riverwoman
        "-",  # Seaman
        (801, 830),  # Smuggler
        "-",  # Stevedore
        "-",  # Wrecker
        (831, 850),  # Bawd
        (851, 900),  # Charlatan
        (901, 910),  # Fence
        "-",  # Grave Robber
        (911, 920),  # Outlaw
        (921, 940),  # Racketeer
        (941, 970),  # Thief
        "-",  # Witch
        "-",  # Cavalryman
        (971, 980),  # Guard
        "-",  # Knight
        "-",  # Pit Fighter
        "-",  # Protagonist"
        (981, 990),  # Soldier
        "-",  # Badger Rider
        "-",  # Slayer
        (991, 1000),  # Warrior Priest
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
