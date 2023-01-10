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
    "Apothecary",
    "Engineer",
    "Artillerist",  # up in arms
    "Lawyer",
    "Nun",
    "Physician",
    "Priest",
    "Scholar",
    "Cartographer",  # up in arms
    "Wizard",
    "Agitator",
    "Artisan",
    "Beggar",
    "Investigator",
    "Merchant",
    "Rat Catcher",
    "Townsman",
    "Watchman",
    "Advisor",
    "Artist",
    "Duellist",
    "Envoy",
    "Noble",
    "Servant",
    "Spy",
    "Warden",
    "Bailiff",
    "Hedge Witch",
    "Herbalist",
    "Hunter",
    "Miner",
    "Mystic",
    "Scout",
    "Villager",
    "Bounty Hunter",
    "Ghost Strider",  # archives of the empire vol 1
    "Coachman",
    "Entertainer",
    "Flagellant",
    "Messenger",
    "Karak Ranger",  # archives of the empire vol 1
    "Pedlar",
    "Camp Follower",  # up in arms
    "Road Warden",
    "Fieldwarden",  # archives of the empire vol 1
    "Witch Hunter",
    "Boatman",
    "Huffer",
    "Riverwarden",
    "Riverwoman",
    "Seaman",
    "Smuggler",
    "Stevedore",
    "Wrecker",
    "Bawd",
    "Charlatan",
    "Fence",
    "Grave Robber",
    "Outlaw",
    "Racketeer",
    "Thief",
    "Witch",
    "Cavalryman",
    "Light Cavalry",  # up in arms
    "Guard",
    "Knight",
    "Freelance",  # up in arms
    "Knight of the Blazing Sun",  # up in arms
    "Knight of the White Wolf",  # up in arms
    "Knight Panther",  # up in arms
    "Pit Fighter",
    "Protagonist",
    "Soldier",
    "Archer",  # up in arms
    "Halberdier",  # up in arms
    "Handgunner",  # up in arms
    "Greatsword",  # up in arms
    "Pikeman",  # up in arms
    "Siege Specialist",  # up in arms
    "Badger Rider",  # archives of the empire vol 1
    "Slayer",
    "Warrior Priest",
    "Warrior Priest of Myrmidia",  # up in arms
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
        (1, 100),  # Apothecary
        (101, 175),  # Engineer
        (176, 200),  # Artillerist
        (201, 300),  # Lawyer
        (301, 500),  # Nun
        (501, 600),  # Physician
        (601, 1100),  # Priest
        (1101, 1270),  # Scholar
        (1271, 1300),  # Cartographer
        (1301, 1400),  # Wizard
        (1401, 1500),  # Agitator
        (1501, 1700),  # Artisan
        (1701, 1900),  # Beggar
        (1901, 2000),  # Investigator
        (2001, 2100),  # Merchant
        (2101, 2300),  # Rat Catcher
        (2301, 2600),  # Townsman
        (2601, 2700),  # Watchman
        (2701, 2800),  # Advisor
        (2801, 2900),  # Artist
        (2901, 3000),  # Duellist
        (3001, 3100),  # Envoy
        (3101, 3200),  # Noble
        (3201, 3500),  # Servant
        (3501, 3600),  # Spy
        (3601, 3700),  # Warden
        (3701, 3800),  # Bailiff
        (3801, 3900),  # Hedge Witch
        (3901, 4000),  # Herbalist
        (4001, 4200),  # Hunter
        (4201, 4300),  # Miner
        (4301, 4400),  # Mystic
        (4401, 4500),  # Scout
        (4501, 5000),  # Villager
        (5001, 5100),  # Bounty Hunter
        "-",  # Ghost Strider
        (5101, 5200),  # Coachman
        (5201, 5400),  # Entertainer
        (5401, 5600),  # Flagellant
        (5601, 5700),  # Messenger
        "-",  # Karak Ranger
        (5701, 5775),  # Pedlar
        (5776, 5800),  # Camp Follower
        (5801, 5900),  # Road Warden
        "-",  # Fieldwarden
        (5901, 6000),  # Witch Hunter
        (6001, 6200),  # Boatman
        (6201, 6300),  # Huffer
        (6301, 6500),  # Riverwarden
        (6501, 6800),  # Riverwoman
        (6801, 7000),  # Seaman
        (7001, 7100),  # Smuggler
        (7101, 7300),  # Stevedore
        (7301, 7400),  # Wrecker
        (7401, 7600),  # Bawd
        (7601, 7700),  # Charlatan
        (7701, 7800),  # Fence
        (7801, 7900),  # Grave Robber
        (7901, 8300),  # Outlaw
        (8301, 8400),  # Racketeer
        (8401, 8700),  # Thief
        (8701, 8800),  # Witch
        (8801, 8950),  # Cavalryman
        (8951, 9000),  # Light Cavalry
        (9001, 9200),  # Guard
        (9201, 9255),  # Knight
        (9256, 9265),  # Freelance
        (9266, 9270),  # Knight of the Blazing Sun
        (9271, 9285),  # Knight of the White Wolf
        (9286, 9300),  # Knight Panther
        (9301, 9400),  # Pit Fighter
        (9401, 9500),  # Protagonist"
        (9501, 9660),  # Soldier
        (9661, 9700),  # Archer
        (9701, 9800),  # Halberdier
        (9801, 9840),  # Handgunner
        (9841, 9860),  # Greatsword
        (9861, 9880),  # Pikeman
        (9881, 9900),  # Siege Specialist
        "-",  # Badger Rider
        "-",  # Slayer
        (9901, 9985),  # Warrior Priest
        (9986, 10000),  # Warrior Priest of Myrmidia
    ],
    "dwarf": [
        (1, 100),  # Apothecary
        (101, 325),  # Engineer
        (326, 400),  # Artillerist
        (401, 600),  # Lawyer
        "-",  # Nun
        (601, 700),  # Physician
        "-",  # Priest
        (701, 870),  # Scholar
        (871, 900),  # Cartographer
        "-",  # Wizard
        (901, 1100),  # Agitator
        (1101, 1700),  # Artisan
        (1701, 1800),  # Beggar
        (1801, 2000),  # Investigator
        (2001, 2400),  # Merchant
        (2401, 2500),  # Rat Catcher
        (2501, 3100),  # Townsman
        (3101, 3400),  # Watchman
        (3401, 3600),  # Advisor
        (3601, 3700),  # Artist
        (3701, 3800),  # Duellist
        (3801, 4000),  # Envoy
        (4001, 4100),  # Noble
        (4101, 4200),  # Servant
        (4201, 4300),  # Spy
        (4301, 4500),  # Warden
        (4501, 4700),  # Bailiff
        "-",  # Hedge Witch
        "-",  # Herbalist
        (4701, 4900),  # Hunter
        (4901, 5400),  # Miner
        "-",  # Mystic
        (5401, 5500),  # Scout
        (5501, 5600),  # Villager
        (5601, 6000),  # Bounty Hunter
        "-",  # Ghost Strider
        (6001, 6100),  # Coachman
        (6101, 6300),  # Entertainer
        "-",  # Flagellant
        (6301, 6400),  # Messenger
        (6401, 6500),  # Karak Ranger
        (6501, 6650),  # Pedlar
        (6651, 6700),  # Camp Follower
        "-",  # Road Warden
        "-",  # Fieldwarden
        "",  # Witch Hunter
        (6701, 6900),  # Boatman
        (6901, 7000),  # Huffer
        "-",  # Riverwarden
        (7001, 7200),  # Riverwoman
        (7201, 7300),  # Seaman
        (7301, 7500),  # Smuggler
        (7501, 7700),  # Stevedore
        (7701, 7800),  # Wrecker
        "-",  # Bawd
        "-",  # Charlatan
        (7801, 7900),  # Fence
        "-",  # Grave Robber
        (7901, 8200),  # Outlaw
        (8201, 8300),  # Racketeer
        (8301, 8400),  # Thief
        "-",  # Witch
        "-",  # Cavalryman
        "-",  # Light Cavalry
        (8401, 8700),  # Guard
        "-",  # Knight
        "-",  # Freelance
        "-",  # Knight of the Blazing Sun
        "-",  # Knight of the White Wolf
        "-",  # Knight Panther
        (8701, 9000),  # Pit Fighter
        (9001, 9300),  # Protagonist"
        (9301, 9450),  # Soldier
        "-",  # Archer
        (9451, 9543),  # Halberdier
        (9544, 9582),  # Handgunner
        "-",  # Greatsword
        "-",  # Pikeman
        (9583, 9600),  # Siege Specialist
        "-",  # Badger Rider
        (9601, 10000),  # Slayer
        "-",  # Warrior Priest
        "-",  # Warrior Priest of Myrmidia
    ],
    "halfling": [
        (1, 100),  # Apothecary
        (101, 175),  # Engineer
        (176, 200),  # Artillerist
        (201, 400),  # Lawyer
        "-",  # Nun
        (401, 600),  # Physician
        "-",  # Priest
        (601, 770),  # Scholar
        (771, 800),  # Cartographer
        "-",  # Wizard
        (801, 1000),  # Agitator
        (1001, 1500),  # Artisan
        (1501, 1900),  # Beggar
        (1901, 2100),  # Investigator
        (2101, 2500),  # Merchant
        (2501, 2800),  # Rat Catcher
        (2801, 3100),  # Townsman
        (3101, 3300),  # Watchman
        (3301, 3400),  # Advisor
        (3401, 3600),  # Artist
        "-",  # Duellist
        (3601, 3700),  # Envoy
        "-",  # Noble
        (3701, 4300),  # Servant
        (4301, 4400),  # Spy
        (4401, 4600),  # Warden
        (4601, 4700),  # Bailiff
        "-",  # Hedge Witch
        (4701, 5000),  # Herbalist
        (5001, 5200),  # Hunter
        (5201, 5300),  # Miner
        "-",  # Mystic
        (5301, 5400),  # Scout
        (5401, 5700),  # Villager
        (5701, 5800),  # Bounty Hunter
        "-",  # Ghost Strider
        (5801, 6000),  # Coachman
        (6001, 6300),  # Entertainer
        "-",  # Flagellant
        (6301, 6500),  # Messenger
        "-",  # Karak Ranger
        (6501, 6650),  # Pedlar
        (6651, 6700),  # Camp Follower
        (6701, 6750),  # Road Warden
        (6751, 6800),  # Fieldwarden
        "-",  # Witch Hunter
        (6801, 6900),  # Boatman
        (6901, 7000),  # Huffer
        (7001, 7100),  # Riverwarden
        (7101, 7400),  # Riverwoman
        (7401, 7500),  # Seaman
        (7501, 7900),  # Smuggler
        (7901, 8200),  # Stevedore
        "-",  # Wrecker
        (8201, 8500),  # Bawd
        (8501, 8600),  # Charlatan
        (8601, 8700),  # Fence
        (8701, 8800),  # Grave Robber
        (8801, 8900),  # Outlaw
        (8901, 9000),  # Racketeer
        (9001, 9400),  # Thief
        "-",  # Witch
        "-",  # Cavalryman
        "-",  # Light Cavalry
        (9401, 9600),  # Guard
        "-",  # Knight
        "-",  # Freelance
        "-",  # Knight of the Blazing Sun
        "-",  # Knight of the White Wolf
        "-",  # Knight Panther
        (9601, 9700),  # Pit Fighter
        "-",  # Protagonist"
        (9701, 9820),  # Soldier
        (9821, 9850),  # Archer
        (9851, 9925),  # Halberdier
        (9926, 9955),  # Handgunner
        "-",  # Greatsword
        "-",  # Pikeman
        "-",  # Siege Specialist
        (9956, 10000),  # Badger Rider
        "-",  # Slayer
        "-",  # Warrior Priest
        "-",  # Warrior Priest of Myrmidia
    ],
    "high_elf": [
        (1, 200),  # Apothecary
        "-",  # Engineer
        "-",  # Artillerist
        (201, 600),  # Lawyer
        "-",  # Nun
        (601, 800),  # Physician
        "-",  # Priest
        (801, 1140),  # Scholar
        (1141, 1200),  # Cartographer
        (1201, 1600),  # Wizard
        "-",  # Agitator
        (1601, 1900),  # Artisan
        "-",  # Beggar
        (1901, 2100),  # Investigator
        (2101, 2600),  # Merchant
        "-",  # Rat Catcher
        (2601, 2800),  # Townsman
        (2801, 2900),  # Watchman
        (2901, 3100),  # Advisor
        (3101, 3200),  # Artist
        (3201, 3400),  # Duellist
        (3401, 3700),  # Envoy
        (3701, 4000),  # Noble
        "-",  # Servant
        (4001, 4300),  # Spy
        (4301, 4500),  # Warden
        "-",  # Bailiff
        "-",  # Hedge Witch
        (4501, 4700),  # Herbalist
        (4701, 5000),  # Hunter
        "-",  # Miner
        "-",  # Mystic
        (5001, 5600),  # Scout
        "-",  # Villager
        (5601, 5900),  # Bounty Hunter
        "-",  # Ghost Strider
        "-",  # Coachman
        (5901, 6200),  # Entertainer
        "-",  # Flagellant
        (6201, 6300),  # Messenger
        "-",  # Karak Ranger
        "-",  # Pedlar
        "-",  # Camp Follower
        "-",  # Road Warden
        "-",  # Fieldwarden
        "-",  # Witch Hunter
        (6301, 6400),  # Boatman
        "-",  # Huffer
        "-",  # Riverwarden
        "-",  # Riverwoman
        (6401, 7900),  # Seaman
        (7901, 8000),  # Smuggler
        "-",  # Stevedore
        "-",  # Wrecker
        (8001, 8200),  # Bawd
        (8201, 8500),  # Charlatan
        "-",  # Fence
        "-",  # Grave Robber
        (8501, 8800),  # Outlaw
        "-",  # Racketeer
        "-",  # Thief
        "-",  # Witch
        (8801, 9100),  # Cavalryman
        (9101, 9200),  # Light Cavalry
        (9201, 9400),  # Guard
        (9401, 9500),  # Knight
        "-",  # Freelance
        "-",  # Knight of the Blazing Sun
        "-",  # Knight of the White Wolf
        "-",  # Knight Panther
        (9501, 9700),  # Pit Fighter
        (9701, 9800),  # Protagonist"
        (9801, 9946),  # Soldier
        (9947, 9982),  # Archer
        "-",  # Halberdier
        "-",  # Handgunner
        "-",  # Greatsword
        "-",  # Pikeman
        (9983, 10000),  # Siege Specialist
        "-",  # Badger Rider
        "-",  # Slayer
        "-",  # Warrior Priest
        "-",  # Warrior Priest of Myrmidia
    ],
    "wood_elf": [
        "-",  # Apothecary
        "-",  # Engineer
        "-",  # Artillerist
        "-",  # Lawyer
        "-",  # Nun
        "-",  # Physician
        "-",  # Priest
        (1, 85),  # Scholar
        (86, 100),  # Cartographer
        (101, 500),  # Wizard
        "-",  # Agitator
        (501, 1000),  # Artisan
        "-",  # Beggar
        "-",  # Investigator
        "-",  # Merchant
        "-",  # Rat Catcher
        "-",  # Townsman
        "-",  # Watchman
        (1001, 1400),  # Advisor
        (1401, 1800),  # Artist
        "-",  # Duellist
        (1801, 2500),  # Envoy
        (2501, 3100),  # Noble
        "-",  # Servant
        (3101, 3500),  # Spy
        "-",  # Warden
        "-",  # Bailiff
        "-",  # Hedge Witch
        (3501, 4200),  # Herbalist
        (4201, 5200),  # Hunter
        "-",  # Miner
        (5201, 5700),  # Mystic
        (5701, 6800),  # Scout
        "-",  # Villager
        (6801, 6900),  # Bounty Hunter
        (6901, 7000),  # Ghost Strider
        "-",  # Coachman
        (7001, 7500),  # Entertainer
        "-",  # Flagellant
        (7501, 7800),  # Messenger
        "-",  # Karak Ranger
        "-",  # Pedlar
        "-",  # Camp Follower
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
        (7801, 7900),  # Wrecker
        "-",  # Bawd
        "-",  # Charlatan
        "-",  # Fence
        "-",  # Grave Robber
        (7901, 8500),  # Outlaw
        "-",  # Racketeer
        "-",  # Thief
        "-",  # Witch
        (8501, 9000),  # Cavalryman
        "-",  # Light Cavalry
        (9001, 9200),  # Guard
        (9201, 9400),  # Knight
        "-",  # Freelance
        "-",  # Knight of the Blazing Sun
        "-",  # Knight of the White Wolf
        "-",  # Knight Panther
        (9401, 9600),  # Pit Fighter
        "-",  # Protagonist"
        (9601, 9920),  # Soldier
        (9921, 10000),  # Archer
        "-",  # Halberdier
        "-",  # Handgunner
        "-",  # Greatsword
        "-",  # Pikeman
        "-",  # Siege Specialist
        "-",  # Badger Rider
        "-",  # Slayer
        "-",  # Warrior Priest
        "-",  # Warrior Priest of Myrmidia
    ],
    "gnome": [
        (1, 100),  # Apothecary
        "-",  # Engineer
        "-",  # Artillerist
        (101, 200),  # Lawyer
        "-",  # Nun
        (201, 400),  # Physician
        (401, 500),  # Priest
        (501, 700),  # Scholar
        "-",  # Cartographer
        (701, 1400),  # Wizard
        (1401, 1500),  # Agitator
        (1501, 1700),  # Artisan"
        (1701, 1800),  # Beggar
        (1801, 1900),  # Investigator
        (1901, 2100),  # Merchant
        (2101, 2200),  # Rat Catcher
        (2201, 2800),  # Townsman
        (2801, 2900),  # Watchman
        (2901, 3000),  # Advisor
        (3001, 3100),  # Artist
        "-",  # Duellist
        (3101, 3200),  # Envoy
        (3201, 3300),  # Noble
        (3301, 3500),  # Servant
        (3501, 4000),  # Spy
        (4001, 4200),  # Warden
        (4201, 4300),  # Bailiff
        "-",  # Hedge Witch
        (4301, 4400),  # Herbalist
        (4401, 4600),  # Hunter
        (4601, 5400),  # Miner
        "-",  # Mystic
        (5401, 5800),  # Scout
        (5801, 6200),  # Villager
        (6201, 6300),  # Bounty Hunter
        "-",  # Ghost Strider
        "-",  # Coachman
        (6301, 6800),  # Entertainer
        "-",  # Flagellant
        (6801, 6900),  # Messenger
        "-",  # Karak Ranger
        (6901, 7500),  # Pedlar
        "-",  # Camp Follower
        "-",  # Road Warden
        "-",  # Fieldwarden
        "-",  # Witch Hunter
        (7501, 7600),  # Boatman
        "-",  # Huffer
        "-",  # Riverwarden
        (7601, 8000),  # Riverwoman
        "-",  # Seaman
        (8001, 8300),  # Smuggler
        "-",  # Stevedore
        "-",  # Wrecker
        (8301, 8500),  # Bawd
        (8501, 9000),  # Charlatan
        (9001, 9100),  # Fence
        "-",  # Grave Robber
        (9101, 9200),  # Outlaw
        (9201, 9400),  # Racketeer
        (9401, 9700),  # Thief
        "-",  # Witch
        "-",  # Cavalryman
        "-",  # Light Cavalry
        (9701, 9800),  # Guard
        "-",  # Knight
        "-",  # Freelance
        "-",  # Knight of the Blazing Sun
        "-",  # Knight of the White Wolf
        "-",  # Knight Panther
        "-",  # Pit Fighter
        "-",  # Protagonist"
        (9801, 9900),  # Soldier
        "-",  # Archer
        "-",  # Halberdier
        "-",  # Handgunner
        "-",  # Greatsword
        "-",  # Pikeman
        "-",  # Siege Specialist
        "-",  # Badger Rider
        "-",  # Slayer
        (9901, 10000),  # Warrior Priest
        "-",  # Warrior Priest of Myrmidia
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
