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
collection_talent = db.talent
collection_skill = db.skill

talents = list(collection_talent.find({"owner_id": "admin"}))
skills = list(collection_skill.find({"owner_id": "admin"}))


class Species(enum.IntEnum):
    HUMAN = 0
    HALFLING = 1
    DWARF = 2
    HIGH_ELF = 3
    WOOD_ELF = 4
    GNOME = 5


def find_id(name, list_of_elems):
    for elem in list_of_elems:
        if elem["name"] == name and elem["owner_id"] == "admin":
            return str(elem["_id"])
    raise Exception(f'"{name}" not found!')


random_talents = [
    ["Acute Sense", 1, 3],
    ["Ambidextrous", 4, 6],
    ["Animal Affinity", 7, 9],
    ["Artistic", 10, 12],
    ["Attractive", 13, 15],
    ["Coolheaded", 16, 18],
    ["Craftsman", 19, 21],
    ["Flee!", 22, 24],
    ["Hardy", 25, 28],
    ["Lightning Reflexes", 29, 31],
    ["Linguistics", 32, 34],
    ["Luck", 35, 38],
    ["Marksman", 39, 41],
    ["Mimic", 42, 44],
    ["Night Vision", 45, 47],
    ["Nimble Fingered", 48, 50],
    ["Noble Blood", 51, 52],
    ["Orientation", 53, 55],
    ["Perfect Pitch", 56, 58],
    ["Pure Soul", 59, 62],
    ["Read/Write", 63, 65],
    ["Resistance", 66, 68],
    ["Savvy", 69, 71],
    ["Sharp", 72, 74],
    ["Sixth Sense", 75, 78],
    ["Strong Legs", 79, 81],
    ["Sturdy", 82, 84],
    ["Suave", 85, 87],
    ["Super Numerate", 88, 91],
    ["Very Resilient", 92, 94],
    ["Very Strong", 95, 97],
    ["Warrior Born", 98, 100],
]

random_talents_ids = []

for r_talent in random_talents:
    random_talents_ids.append([find_id(r_talent[0], talents), r_talent[1], r_talent[2] + 1])

species_talents = {
    str(Species.HUMAN.value): ["Doomed", ["Savvy", "Suave"], "random", "random", "random"],
    str(Species.HALFLING.value): [
        "Acute Sense - Taste",
        "Night Vision",
        "Resistance - Chaos",
        "Small",
        "random",
    ],
    str(Species.DWARF.value): [
        "Magic Resistance",
        "Night Vision",
        ["Read/Write", "Relentless"],
        ["Resolute", "Strong-minded"],
        "Sturdy",
    ],
    str(Species.HIGH_ELF.value): [
        "Acute Sense - Sight",
        ["Coolheaded", "Savvy"],
        "Night Vision",
        ["Second Sight", "Sixth Sense"],
        "Read/Write",
    ],
    str(Species.WOOD_ELF.value): [
        "Acute Sense - Sight",
        ["Hardy", "Second Sight"],
        "Night Vision",
        ["Read/Write", "Very Resilient"],
        "Rover",
    ],
    str(Species.GNOME.value): [
        ["Beneath Notice", "Suffused with Ulgu"],
        ["Luck", "Mimic"],
        "Night Vision",
        ["Fisherman", "Read/Write"],
        ["Second Sight", "Sixth Sense"],
        "Small",
    ],
}

species_talents_ids = {}
for species, s_talents in species_talents.items():
    species_talents_ids[species] = []
    for s_talent in s_talents:
        if s_talent == "random":
            species_talents_ids[species].append("random")
        elif isinstance(s_talent, list):
            talent_id = []
            for sub_talent in s_talent:
                talent_id.append(find_id(sub_talent, talents))
            species_talents_ids[species].append(talent_id)
        else:
            species_talents_ids[species].append(find_id(s_talent, talents))

species_skills = {
    str(Species.HUMAN.value): [
        "Animal Care",
        "Charm",
        "Cool",
        "Evaluate",
        "Gossip",
        "Haggle",
        "Language - Bretonnian",
        "Language - Wastelander",
        "Leadership",
        "Lore - Reikland",
        "Melee - Basic",
        "Ranged - Bow",
    ],
    str(Species.HALFLING.value): [
        "Charm",
        "Consume Alcohol",
        "Dodge",
        "Gamble",
        "Haggle",
        "Intuition",
        "Language - Mootish",
        "Lore - Reikland",
        "Perception",
        "Sleight of Hand",
        "Stealth",
        "Trade - Cook",
    ],
    str(Species.DWARF.value): [
        "Consume Alcohol",
        "Cool",
        "Endurance",
        "Entertain - Storytelling",
        "Evaluate",
        "Intimidate",
        "Language - Khazalid",
        "Lore - Dwarfs",
        "Lore - Geology",
        "Lore - Metallurgy",
        "Melee - Basic",
        "Trade",
    ],
    str(Species.HIGH_ELF.value): [
        "Cool",
        "Entertain - Sing",
        "Evaluate",
        "Language - Eltharin",
        "Leadership",
        "Melee - Basic",
        "Navigation",
        "Perception",
        "Play",
        "Ranged - Bow",
        "Sail",
        "Swim",
    ],
    str(Species.WOOD_ELF.value): [
        "Athletics",
        "Climb",
        "Endurance",
        "Entertain - Sing",
        "Intimidate",
        "Language - Eltharin",
        "Melee - Basic",
        "Outdoor Survival",
        "Perception",
        "Ranged - Bow",
        "Stealth - Rural",
        "Track",
    ],
    str(Species.GNOME.value): [
        "Channelling - Ulgu",
        "Charm",
        "Consume Alcohol",
        "Dodge",
        "Entertain",
        "Gossip",
        "Haggle",
        "Language - Ghassally",
        "Language - Magick",
        "Language - Wastelander",
        "Outdoor Survival",
        "Stealth",
    ],
}

species_skills_ids = {}
for species, s_skills in species_skills.items():
    species_skills_ids[species] = []
    for s_skill in s_skills:
        species_skills_ids[species].append(find_id(s_skill, skills))

collection.update_one({"name": "generation_props"}, {"$set": {"random_talents": random_talents_ids}})
collection.update_one({"name": "generation_props"}, {"$set": {"species_talents": species_talents_ids}})
collection.update_one({"name": "generation_props"}, {"$set": {"species_skills": species_skills_ids}})
