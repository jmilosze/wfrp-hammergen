import enum
import os
import sys

from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

print(f"Are you sure you want to run this in {MONGO_URI}?")
x = input()
if x != "yes":
    sys.exit()

db = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)
collection = db.other
collection_career = db.career
collection_item = db.item

species_num = {
    "human": "0",
    "halfling": "1",
    "dwarf": "2",
    "high_elf": "3",
    "wood_elf": "4",
    "gnome": "5",
    "ogre": "6",
}

species_careers = {
    "human": [
        ["Apothecary", 1, 75],
        ["Mundane Alchemist (Human)", 76, 100],
        ["Engineer", 101, 175],
        ["Artillerist", 176, 200],
        ["Lawyer", 201, 300],
        ["Nun", 301, 500],
        ["Physician", 501, 600],
        ["Priest of Handrich", 601, 650],
        ["Priest of Solkan", 651, 700],
        ["Priestesses of Rhya", 701, 750],
        ["Priest", 751, 1100],
        ["Scholar", 1101, 1270],
        ["Cartographer", 1271, 1300],
        ["Wizard", 1301, 1315],
        ["Hierophant", 1316, 1325],
        ["Alchemist", 1326, 1335],
        ["Druid", 1336, 1345],
        ["Astromancer", 1346, 1355],
        ["Shadowmancer", 1356, 1365],
        ["Spiriter", 1366, 1375],
        ["Pyromancer", 1376, 1385],
        ["Shaman", 1386, 1395],
        ["Magister Vigilant", 1396, 1400],
        ["Agitator", 1401, 1500],
        ["Artisan", 1501, 1700],
        ["Beggar", 1701, 1900],
        ["Investigator", 1901, 2000],
        ["Merchant", 2001, 2100],
        ["Rat Catcher", 2101, 2300],
        ["Townsman", 2301, 2600],
        ["Watchman", 2601, 2700],
        ["Advisor", 2701, 2800],
        ["Artist", 2801, 2900],
        ["Duellist", 2901, 3000],
        ["Envoy", 3001, 3100],
        ["Noble", 3101, 3200],
        ["Servant", 3201, 3500],
        ["Spy", 3501, 3600],
        ["Warden", 3601, 3700],
        ["Bailiff", 3701, 3800],
        ["Hedge Witch", 3801, 3900],
        ["Herbalist", 3901, 4000],
        ["Hunter", 4001, 4200],
        ["Miner", 4201, 4300],
        ["Mystic", 4301, 4390],
        ["Scryer", 4391, 4400],
        ["Scout", 4401, 4500],
        ["Villager", 4501, 5000],
        ["Bounty Hunter", 5001, 5100],
        ["Coachman", 5101, 5200],
        ["Entertainer", 5201, 5400],
        ["Flagellant", 5401, 5600],
        ["Messenger", 5601, 5700],
        ["Pedlar", 5701, 5775],
        ["Camp Follower", 5776, 5800],
        ["Road Warden", 5801, 5900],
        ["Witch Hunter", 5901, 6000],
        ["Boatman", 6001, 6200],
        ["Huffer", 6201, 6300],
        ["Riverwarden", 6301, 6500],
        ["Riverwoman", 6501, 6800],
        ["Seaman", 6801, 7000],
        ["Smuggler", 7001, 7100],
        ["Stevedore", 7101, 7300],
        ["Wrecker", 7301, 7400],
        ["Bawd", 7401, 7600],
        ["Charlatan", 7601, 7700],
        ["Fence", 7701, 7800],
        ["Grave Robber", 7801, 7900],
        ["Outlaw", 7901, 8300],
        ["Racketeer", 8301, 8400],
        ["Thief", 8401, 8700],
        ["Witch", 8701, 8800],
        ["Cavalryman", 8801, 8950],
        ["Light Cavalry", 8951, 9000],
        ["Guard", 9001, 9150],
        ["Beadle", 9151, 9200],
        ["Knight", 9201, 9255],
        ["Freelance", 9256, 9265],
        ["Knight of the Blazing Sun", 9266, 9270],
        ["Knight of the White Wolf", 9271, 9285],
        ["Knight Panther", 9286, 9300],
        ["Pit Fighter", 9301, 9400],
        ["Protagonist", 9401, 9500],
        ["Soldier", 9501, 9660],
        ["Archer", 9661, 9700],
        ["Halberdier", 9701, 9800],
        ["Handgunner", 9801, 9840],
        ["Greatsword", 9841, 9860],
        ["Pikeman", 9861, 9880],
        ["Siege Specialist", 9881, 9900],
        ["Warrior Priest", 9901, 9985],
        ["Warrior Priest of Myrmidia", 9986, 10000],
    ],
    "dwarf": [
        ["Apothecary", 1, 75],
        ["Mundane Alchemist (Dwarf, Halfling)", 76, 100],
        ["Engineer", 101, 325],
        ["Artillerist", 326, 400],
        ["Lawyer", 401, 600],
        ["Physician", 601, 700],
        ["Scholar", 701, 870],
        ["Cartographer", 871, 900],
        ["Agitator", 901, 1100],
        ["Artisan", 1101, 1700],
        ["Beggar", 1701, 1800],
        ["Investigator", 1801, 2000],
        ["Merchant", 2001, 2400],
        ["Rat Catcher", 2401, 2500],
        ["Townsman", 2501, 3100],
        ["Watchman", 3101, 3400],
        ["Advisor", 3401, 3600],
        ["Artist", 3601, 3700],
        ["Duellist", 3701, 3800],
        ["Envoy", 3801, 4000],
        ["Noble", 4001, 4100],
        ["Servant", 4101, 4200],
        ["Spy", 4201, 4300],
        ["Warden", 4301, 4500],
        ["Bailiff", 4501, 4700],
        ["Hunter", 4701, 4900],
        ["Miner", 4901, 5400],
        ["Scout", 5401, 5500],
        ["Villager", 5501, 5600],
        ["Bounty Hunter", 5601, 6000],
        ["Coachman", 6001, 6100],
        ["Entertainer", 6101, 6300],
        ["Messenger", 6301, 6400],
        ["Karak Ranger", 6401, 6500],
        ["Pedlar", 6501, 6650],
        ["Camp Follower", 6651, 6700],
        ["Boatman", 6701, 6900],
        ["Huffer", 6901, 7000],
        ["Riverwoman", 7001, 7200],
        ["Seaman", 7201, 7300],
        ["Smuggler", 7301, 7500],
        ["Stevedore", 7501, 7700],
        ["Wrecker", 7701, 7800],
        ["Fence", 7801, 7900],
        ["Outlaw", 7901, 8200],
        ["Racketeer", 8201, 8300],
        ["Thief", 8301, 8400],
        ["Guard", 8401, 8625],
        ["Beadle", 8626, 8700],
        ["Pit Fighter", 8701, 9000],
        ["Protagonist", 9001, 9300],
        ["Soldier", 9301, 9450],
        ["Halberdier", 9451, 9543],
        ["Handgunner", 9544, 9582],
        ["Siege Specialist", 9583, 9600],
        ["Slayer", 9601, 10000],
    ],
    "halfling": [
        ["Apothecary", 1, 75],
        ["Mundane Alchemist (Dwarf, Halfling)", 76, 100],
        ["Engineer", 101, 175],
        ["Artillerist", 176, 200],
        ["Lawyer", 201, 400],
        ["Physician", 401, 600],
        ["Scholar", 601, 770],
        ["Cartographer", 771, 800],
        ["Agitator", 801, 1000],
        ["Artisan", 1001, 1500],
        ["Beggar", 1501, 1900],
        ["Investigator", 1901, 2100],
        ["Merchant", 2101, 2500],
        ["Rat Catcher", 2501, 2800],
        ["Townsman", 2801, 3100],
        ["Watchman", 3101, 3300],
        ["Advisor", 3301, 3400],
        ["Artist", 3401, 3600],
        ["Envoy", 3601, 3700],
        ["Servant", 3701, 4300],
        ["Spy", 4301, 4400],
        ["Warden", 4401, 4600],
        ["Bailiff", 4601, 4700],
        ["Herbalist", 4701, 5000],
        ["Hunter", 5001, 5200],
        ["Miner", 5201, 5300],
        ["Scout", 5301, 5400],
        ["Villager", 5401, 5700],
        ["Bounty Hunter", 5701, 5800],
        ["Coachman", 5801, 6000],
        ["Entertainer", 6001, 6300],
        ["Messenger", 6301, 6500],
        ["Pedlar", 6501, 6650],
        ["Camp Follower", 6651, 6700],
        ["Road Warden", 6701, 6750],
        ["Fieldwarden", 6751, 6800],
        ["Boatman", 6801, 6900],
        ["Huffer", 6901, 7000],
        ["Riverwarden", 7001, 7100],
        ["Riverwoman", 7101, 7400],
        ["Seaman", 7401, 7500],
        ["Smuggler", 7501, 7900],
        ["Stevedore", 7901, 8200],
        ["Bawd", 8201, 8500],
        ["Charlatan", 8501, 8600],
        ["Fence", 8601, 8700],
        ["Grave Robber", 8701, 8800],
        ["Outlaw", 8801, 8900],
        ["Racketeer", 8901, 9000],
        ["Thief", 9001, 9400],
        ["Guard", 9401, 9550],
        ["Beadle", 9551, 9600],
        ["Pit Fighter", 9601, 9700],
        ["Soldier", 9701, 9820],
        ["Archer", 9821, 9850],
        ["Halberdier", 9851, 9925],
        ["Handgunner", 9926, 9955],
        ["Badger Rider", 9956, 10000],
    ],
    "high_elf": [
        ["Apothecary", 1, 200],
        ["Lawyer", 201, 600],
        ["Physician", 601, 800],
        ["Scholar", 801, 1140],
        ["Cartographer", 1141, 1200],
        ["Wizard", 1201, 1600],
        ["Artisan", 1601, 1900],
        ["Investigator", 1901, 2100],
        ["Merchant", 2101, 2600],
        ["Townsman", 2601, 2800],
        ["Watchman", 2801, 2900],
        ["Advisor", 2901, 3100],
        ["Artist", 3101, 3200],
        ["Duellist", 3201, 3400],
        ["Envoy", 3401, 3700],
        ["Noble", 3701, 4000],
        ["Spy", 4001, 4300],
        ["Warden", 4301, 4500],
        ["Herbalist", 4501, 4700],
        ["Hunter", 4701, 5000],
        ["Scout", 5001, 5600],
        ["Bounty Hunter", 5601, 5900],
        ["Entertainer", 5901, 6200],
        ["Messenger", 6201, 6300],
        ["Boatman", 6301, 6400],
        ["Seaman", 6401, 7900],
        ["Smuggler", 7901, 8000],
        ["Bawd", 8001, 8200],
        ["Charlatan", 8201, 8500],
        ["Outlaw", 8501, 8800],
        ["Cavalryman", 8801, 9100],
        ["Light Cavalry", 9101, 9200],
        ["Guard", 9201, 9400],
        ["Knight", 9401, 9500],
        ["Pit Fighter", 9501, 9700],
        ["Protagonist", 9701, 9800],
        ["Soldier", 9801, 9946],
        ["Archer", 9947, 9982],
        ["Siege Specialist", 9983, 10000],
    ],
    "wood_elf": [
        ["Scholar", 1, 85],
        ["Cartographer", 86, 100],
        ["Wizard", 101, 500],
        ["Artisan", 501, 1000],
        ["Advisor", 1001, 1400],
        ["Artist", 1401, 1800],
        ["Envoy", 1801, 2500],
        ["Noble", 2501, 3100],
        ["Spy", 3101, 3500],
        ["Herbalist", 3501, 4200],
        ["Hunter", 4201, 5200],
        ["Mystic", 5201, 5700],
        ["Scout", 5701, 6800],
        ["Bounty Hunter", 6801, 6900],
        ["Ghost Strider", 6901, 7000],
        ["Entertainer", 7001, 7500],
        ["Messenger", 7501, 7800],
        ["Wrecker", 7801, 7900],
        ["Outlaw", 7901, 8500],
        ["Cavalryman", 8501, 9000],
        ["Guard", 9001, 9200],
        ["Knight", 9201, 9400],
        ["Pit Fighter", 9401, 9600],
        ["Soldier", 9601, 9920],
        ["Archer", 9921, 10000],
    ],
    "gnome": [
        ["Apothecary", 1, 100],
        ["Lawyer", 101, 200],
        ["Physician", 201, 400],
        ["Priest", 401, 500],
        ["Scholar", 501, 700],
        ["Wizard", 701, 1400],
        ["Agitator", 1401, 1500],
        ["Artisan", 1501, 1700],
        ["Beggar", 1701, 1800],
        ["Investigator", 1801, 1900],
        ["Merchant", 1901, 2100],
        ["Rat Catcher", 2101, 2200],
        ["Townsman", 2201, 2800],
        ["Watchman", 2801, 2900],
        ["Advisor", 2901, 3000],
        ["Artist", 3001, 3100],
        ["Envoy", 3101, 3200],
        ["Noble", 3201, 3300],
        ["Servant", 3301, 3500],
        ["Spy", 3501, 4000],
        ["Warden", 4001, 4200],
        ["Bailiff", 4201, 4300],
        ["Herbalist", 4301, 4400],
        ["Hunter", 4401, 4600],
        ["Miner", 4601, 5400],
        ["Scout", 5401, 5800],
        ["Villager", 5801, 6200],
        ["Bounty Hunter", 6201, 6300],
        ["Entertainer", 6301, 6800],
        ["Messenger", 6801, 6900],
        ["Pedlar", 6901, 7500],
        ["Boatman", 7501, 7600],
        ["Riverwoman", 7601, 8000],
        ["Smuggler", 8001, 8300],
        ["Bawd", 8301, 8500],
        ["Charlatan", 8501, 9000],
        ["Fence", 9001, 9100],
        ["Outlaw", 9101, 9200],
        ["Racketeer", 9201, 9400],
        ["Thief", 9401, 9700],
        ["Guard", 9701, 9800],
        ["Soldier", 9801, 9900],
        ["Warrior Priest", 9901, 10000],
    ],
    "ogre": [
        ["Ogre Butcher", 1, 100],
        ["Artisan", 101, 200],
        ["Beggar", 201, 500],
        ["Rat Catcher", 501, 600],
        ["Watchman", 601, 1200],
        ["Servant", 1201, 1300],
        ["Bailiff", 1301, 1400],
        ["Hunter", 1401, 2100],
        ["Miner", 2101, 2300],
        ["Rhinox Herder", 2301, 2600],
        ["Bounty Hunter", 2601, 2900],
        ["Entertainer", 2901, 3200],
        ["Pedlar", 3201, 3900],
        ["Seaman", 3901, 4000],
        ["Stevedore", 4001, 4300],
        ["Grave Robber", 4301, 4700],
        ["Outlaw", 4701, 5600],
        ["Racketeer", 5601, 6100],
        ["Guard", 6101, 6800],
        ["Pit Fighter", 6801, 7900],
        ["Protagonist", 7901, 8400],
        ["Maneater", 8401, 9100],
        ["Soldier", 9101, 10000],
    ],
}

# validate ranges and names
species_career_names = {}
for species, careers in species_careers.items():
    prev_max = 0
    species_career_names[species] = set()
    for career in careers:
        if career[1] != prev_max + 1 or career[2] > 10000:
            raise Exception(f"Invalid {species} career {career}")
        if career[0] in species_career_names[species]:
            raise Exception(f"Duplicated {species} career {career}")
        prev_max = career[2]
        species_career_names[species].add(career[0])

# get unique career names
career_names = set()
for career_name in species_career_names.values():
    career_names.update(career_name)

# get ids of careers
career_ids = {}
db_careers = list(collection_career.find({"owner_id": "admin"}))
for career_name in career_names:
    for db_career in db_careers:
        if db_career["name"] == career_name:
            career_ids[career_name] = str(db_career["_id"])
            break
    else:
        raise Exception(f"Career {career_name} not found!")

# create table to upload
career_gen_table = {}
for species, careers in species_careers.items():
    career_gen_table[species_num[species]] = []
    for career in careers:
        career_gen_table[species_num[species]].append([career_ids[career[0]], career[1], career[2] + 1])

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
    "Rope - 10 yards",
    "Flask of Spirits",
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
    SEAFARER = 8


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
    str(CareerCass.SEAFARER.value): {
        "equipped": [
            {"id": iids["Cloak"], "number": 1},
            {"id": iids["Clothing"], "number": 1},
            {"id": iids["Dagger"], "number": 1},
            {"id": iids["Pouch"], "number": 1},
            {"id": iids["Sling Bag"], "number": 1},
        ],
        "carried": [
            {"id": iids["Rope - 10 yards"], "number": 1},
            {"id": iids["Flask of Spirits"], "number": 1},
        ],
    },
}

collection.update_one({"name": "generation_props"}, {"$set": {"career_gen_table": career_gen_table}})
collection.update_one({"name": "generation_props"}, {"$set": {"class_items": class_items}})
