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


class Species(enum.Enum):
    HUMAN_DEFAULT = "0000"
    HUMAN_REIKLAND = "0001"  # WFRP p. 25
    HUMAN_ALTDORF_SOUTH_BANK = "0002"  # Archives III p. 83
    HUMAN_ALTDORF_EASTEND = "0003"  # Archives III p. 83
    HUMAN_ALTDORF_HEXXERBEZRIK = "0004"  # Archives III p. 84
    HUMAN_ALTDORF_DOCKLANDS = "0005"  # Archives III p. 84
    HUMAN_MIDDENHEIM = "0006"  # Middenheim p. 151
    HUMAN_MIDDENLAND = "0007"  # Middenheim p. 152, Salzenmund p. 142
    HUMAN_NORDLAND = "0008"  # Middenheim p. 153
    HUMAN_SALZENMUND = "0009"  # Salzenmund p. 142
    HUMAN_TILEA = "0010"  # Up in Arms p. 55
    HUMAN_NORSE_BJORNLING = "0011"  # Sea of Claws p. 56
    HUMAN_NORSE_SARL = "0012"  # Sea of Claws p. 56
    HUMAN_NORSE_SKAELING = "0013"  # Sea of Claws p. 56
    HALFLING_DEFAULT = "0100"  # WFRP p. 26
    DWARF_DEFAULT = "0200"  # WFRP p. 25
    DWARF_ALTDORF = "0201"  # Archives III p. 83
    DWARF_CRAGFORGE_CLAN = "0202"  # Salzenmund p. 142
    DWARF_GRUMSSON_CLAN = "0203"  # Salzenmund p. 142
    DWARF_NORSE = "0204"  # Sea of Claws p. 41
    HIGH_ELF_DEFAULT = "0300"  # WFRP p. 27
    WOOD_ELF_DEFAULT = "0400"  # WFRP p. 28
    GNOME_DEFAULT = "0500"  # Rough Nights and Hard Days p. 86
    OGRE_DEFAULT = "0600"  # Archives II p. 18


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
    str(Species.HUMAN_DEFAULT.value): ["Doomed", ["Savvy", "Suave"], "random", "random", "random"],
    str(Species.HUMAN_REIKLAND.value): ["Doomed", ["Savvy", "Suave"], "random", "random", "random"],
    str(Species.HUMAN_ALTDORF_SOUTH_BANK.value): [
        "Doomed",
        "Etiquette",
        ["Noble Blood", "Pure Soul"],
        ["Read/Write", "Supportive"],
        ["Savvy", "Suave"],
    ],
    str(Species.HUMAN_ALTDORF_EASTEND.value): [
        ["Argumentative", "Flee!"],
        ["Criminal", "random"],
        "Doomed",
        ["Nimble Fingered", "Read/Write"],
        ["Savvy", "Suave"],
    ],
    str(Species.HUMAN_ALTDORF_HEXXERBEZRIK.value): [
        "Doomed",
        ["Beneath Notice", "Read/Write"],
        ["Savvy", "Suave"],
        ["Second Sight", "Sixth Sense"],
        "random",
    ],
    str(Species.HUMAN_ALTDORF_DOCKLANDS.value): [
        ["Criminal", "Etiquette - Guilder - Merchant"],
        ["Dealmaker", "Menacing"],
        "Doomed",
        ["Savvy", "Suave"],
        "random",
    ],
    str(Species.HUMAN_MIDDENHEIM.value): ["Doomed", ["Etiquette", "Strong Back"], "random", "random", "random"],
    str(Species.HUMAN_MIDDENLAND.value): [
        ["Doomed", "random"],
        ["Menacing", "Warrior Born"],
        "random",
        "random",
        "random",
    ],
    str(Species.HUMAN_NORDLAND.value): [
        ["Doomed", "random"],
        ["Fisherman", "Rover"],
        ["Stout-hearted", "Very Resilient"],
        "random",
        "random",
    ],
    str(Species.HUMAN_SALZENMUND.value): ["Doomed", ["Savvy", "Suave"], "random", "random", "random"],
    str(Species.HUMAN_TILEA.value): [
        ["Argumentative", "Fisherman"],
        ["Coolheaded", "Suave"],
        "random",
        "random",
        "random",
    ],
    str(Species.HUMAN_NORSE_BJORNLING.value): [
        ["Fisherman", "War Leader"],
        "Resistance - Chaos",
        ["Sea Legs", "Warrior Born"],
        "random",
        "random",
    ],
    str(Species.HUMAN_NORSE_SARL.value): [
        ["Crack the Whip", "Old Salt"],
        "Resistance - Chaos",
        ["Roughrider", "Sea Legs"],
        "random",
        "random",
    ],
    str(Species.HUMAN_NORSE_SKAELING.value): [
        ["Beneath Notice", "Resolute"],
        ["Berserk Charge", "Flee!"],
        "Resistance - Chaos",
        "random",
        "random",
    ],
    str(Species.HALFLING_DEFAULT.value): [
        "Acute Sense - Taste",
        "Night Vision",
        "Resistance - Chaos",
        "Small",
        "random",
        "random",
    ],
    str(Species.DWARF_DEFAULT.value): [
        "Magic Resistance",
        "Night Vision",
        ["Read/Write", "Relentless"],
        ["Resolute", "Strong-minded"],
        "Sturdy",
    ],
    str(Species.DWARF_ALTDORF.value): [
        ["Craftsman", "Resolute"],
        "Magic Resistance",
        "Night Vision",
        ["Read/Write", "Relentless"],
        "Sturdy",
    ],
    str(Species.DWARF_CRAGFORGE_CLAN.value): [
        "Magic Resistance",
        "Night Vision",
        ["Read/Write", "Relentless"],
        ["Resolute", "Strong-minded"],
        "Sturdy",
    ],
    str(Species.DWARF_GRUMSSON_CLAN.value): [
        "Magic Resistance",
        "Night Vision",
        ["Relentless", "Strong-minded"],
        "Sturdy",
        "random",
    ],
    str(Species.DWARF_NORSE.value): [
        ["Carouser", "Strong-minded"],
        "Magic Resistance",
        "Night Vision",
        ["Read/Write", "Relentless"],
        "Sturdy",
    ],
    str(Species.HIGH_ELF_DEFAULT.value): [
        "Acute Sense - Sight",
        ["Coolheaded", "Savvy"],
        "Night Vision",
        ["Second Sight", "Sixth Sense"],
        "Read/Write",
    ],
    str(Species.WOOD_ELF_DEFAULT.value): [
        "Acute Sense - Sight",
        ["Hardy", "Second Sight"],
        "Night Vision",
        ["Read/Write", "Very Resilient"],
        "Rover",
    ],
    str(Species.GNOME_DEFAULT.value): [
        ["Beneath Notice", "Suffused With Ulgu"],
        ["Luck", "Mimic"],
        "Night Vision",
        ["Fisherman", "Read/Write"],
        ["Second Sight", "Sixth Sense"],
        "Small",
    ],
    str(Species.OGRE_DEFAULT.value): [
        "Dirty Fighting",
        "Large",
        "Night Vision",
        "Resistance - Poison (Ingested)",
        ["Very Resilient", "Very Strong"],
        "Vice - Food",
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
                if sub_talent == "random":
                    talent_id.append("random")
                else:
                    talent_id.append(find_id(sub_talent, talents))
            species_talents_ids[species].append(talent_id)
        else:
            species_talents_ids[species].append(find_id(s_talent, talents))

species_skills = {
    str(Species.HUMAN_DEFAULT.value): [
        "Animal Care",
        "Charm",
        "Cool",
        "Evaluate",
        "Gossip",
        "Haggle",
        "Language - Bretonnian",
        "Language - Wastelander",
        "Leadership",
        "Lore - Local - Reikland",
        "Melee - Basic",
        "Ranged - Bow",
    ],
    str(Species.HUMAN_REIKLAND.value): [
        "Animal Care",
        "Charm",
        "Cool",
        "Evaluate",
        "Gossip",
        "Haggle",
        "Language - Bretonnian",
        "Language - Wastelander",
        "Leadership",
        "Lore - Local - Reikland",
        "Melee - Basic",
        "Ranged - Bow",
    ],
    str(Species.HUMAN_ALTDORF_SOUTH_BANK.value): [
        "Animal Care",
        "Charm",
        "Cool",
        "Gossip",
        "Language",
        "Leadership",
        "Lore",
        "Melee - Basic",
        "Melee - Fencing",
        "Ranged - Blackpowder",
        "Ranged - Bow",
        "Ride",
    ],
    str(Species.HUMAN_ALTDORF_EASTEND.value): [
        "Cool",
        "Evaluate",
        "Gossip",
        "Haggle",
        "Intimidate",
        "Intuition",
        "Language - Battle or Thief",
        "Lore - Local - Reikland",
        "Melee - Brawling",
        "Ranged - Blackpowder",
        "Sleight of Hand",
        "Stealth",
    ],
    str(Species.HUMAN_ALTDORF_HEXXERBEZRIK.value): [
        "Cool",
        "Evaluate",
        "Gossip",
        "Intimidate",
        "Intuition",
        "Language - Classical",
        "Lore - Local - Reikland",
        "Lore - Magic",
        "Melee - Basic",
        "Perception",
        "Sleight of Hand",
        "Stealth",
    ],
    str(Species.HUMAN_ALTDORF_DOCKLANDS.value): [
        "Consume Alcohol",
        "Evaluate",
        "Gossip",
        "Haggle",
        "Intimidate",
        "Intuition",
        "Language - Thief",
        "Lore - Local - Reikland",
        "Melee - Brawling",
        "Row",
        "Sail",
        "Sleight of Hand",
    ],
    str(Species.HUMAN_MIDDENHEIM.value): [
        "Bribery",
        "Charm",
        "Cool",
        "Entertain",
        "Evaluate",
        "Gossip",
        "Haggle",
        "Leadership",
        "Lore - Local - Middenheim",
        "Melee - Basic",
        "Ranged - Bow",
        "Trade",
    ],
    str(Species.HUMAN_MIDDENLAND.value): [
        "Animal Care",
        "Cool",
        "Evaluate",
        "Gossip",
        "Haggle",
        "Intimidate",
        "Language - Wastelander",
        "Leadership",
        "Lore - Local - Middenland",
        "Melee - Basic",
        "Outdoor Survival",
        "Ranged - Bow",
    ],
    str(Species.HUMAN_NORDLAND.value): [
        "Consume Alcohol",
        "Evaluate",
        "Gossip",
        "Haggle",
        "Language - Norse",
        "Language - Wastelander",
        "Lore - Local - Nordland",
        "Melee - Basic",
        "Ranged - Bow",
        "Sail",
        "Swim",
        "Trade",
    ],
    str(Species.HUMAN_SALZENMUND.value): [
        "Charm",
        "Cool",
        "Entertain - Storytelling",
        "Evaluate",
        "Gossip",
        "Haggle",
        "Language - Norse",
        "Leadership",
        "Lore - Local - Nordland",
        "Melee - Basic",
        "Ranged - Bow",
        "Trade",
    ],
    str(Species.HUMAN_TILEA.value): [
        "Charm",
        "Cool",
        "Evaluate",
        "Gossip",
        "Haggle",
        "Language - Arabyan",
        "Language - Reikspiel",
        "Language - Estalian",
        "Lore - Local - Tilea",
        "Melee - Basic",
        "Ranged - Crossbow",
        "Sail",
    ],
    str(Species.HUMAN_NORSE_BJORNLING.value): [
        "Consume Alcohol",
        "Evaluate",
        "Gossip",
        "Haggle",
        "Language - Reikspiel",
        "Language - Wastelander",
        "Lore - Local - Norsca",
        "Melee - Basic",
        "Row",
        "Sail",
        "Swim",
        "Trade",
    ],
    str(Species.HUMAN_NORSE_SARL.value): [
        "Animal Care",
        "Consume Alcohol",
        "Gossip",
        "Language - Reikspiel",
        "Language - Gospodarinyi",
        "Lore - Local - Norsca",
        "Melee - Basic",
        "Ride",
        "Row",
        "Sail",
        "Swim",
        "Trade",
    ],
    str(Species.HUMAN_NORSE_SKAELING.value): [
        "Consume Alcohol",
        "Cool",
        "Endurance",
        "Entertain - Storytelling",
        "Language - Reikspiel",
        "Language - Wastelander",
        "Lore - Khorne",
        "Melee - Basic",
        "Melee - Two Handed",
        "Row",
        "Sail",
        "Swim",
    ],
    str(Species.HALFLING_DEFAULT.value): [
        "Charm",
        "Consume Alcohol",
        "Dodge",
        "Gamble",
        "Haggle",
        "Intuition",
        "Language - Mootish",
        "Lore - Local - Reikland",
        "Perception",
        "Sleight of Hand",
        "Stealth",
        "Trade - Cook",
    ],
    str(Species.DWARF_DEFAULT.value): [
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
    str(Species.DWARF_ALTDORF.value): [
        "Consume Alcohol",
        "Cool",
        "Endurance",
        "Evaluate",
        "Intimidate",
        "Intuition",
        "Language - Khazalid",
        "Lore - Dwarfs",
        "Lore - Geology",
        "Lore - Metallurgy",
        "Melee - Basic",
        "Trade",
    ],
    str(Species.DWARF_CRAGFORGE_CLAN.value): [
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
        "Trade - Silversmith",
    ],
    str(Species.DWARF_GRUMSSON_CLAN.value): [
        "Consume Alcohol",
        "Cool",
        "Endurance",
        "Entertain - Storytelling",
        "Evaluate",
        "Intimidate",
        "Language - Norse",
        "Language - Khazalid",
        "Lore - Dwarfs",
        "Melee - Basic",
        "Sail",
        "Trade",
    ],
    str(Species.DWARF_NORSE.value): [
        "Climb",
        "Consume Alcohol",
        "Cool",
        "Endurance",
        "Entertain - Storytelling",
        "Evaluate",
        "Language - Khazalid",
        "Language - Norse",
        "Lore - Dwarfs",
        "Melee - Basic",
        "Sail",
        "Trade",
    ],
    str(Species.HIGH_ELF_DEFAULT.value): [
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
    str(Species.WOOD_ELF_DEFAULT.value): [
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
    str(Species.GNOME_DEFAULT.value): [
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
    str(Species.OGRE_DEFAULT.value): [
        "Athletics",
        "Consume Alcohol",
        "Endurance",
        "Entertain - Storytelling",
        "Intimidate",
        "Language - Grumbarth",
        "Lore - Ogres",
        "Melee - Basic",
        "Melee - Brawling",
        "Navigation",
        "Outdoor Survival",
        "Track",
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
