import os
from pymongo import MongoClient
import re

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

DB = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)

RE = r"\(([^()]*)\)$"

PATTERNS = [
    {"name": "Rulebook", "value": "1"},
    {"name": "Up in Arms", "value": "6"},
    {"name": "up in Arms", "value": "6"},
    {"name": "Up In Arms", "value": "6"},
    {"name": "Archives of the Empire Vol III", "value": "5"},
    {"name": "Archives of the Empire Vol II", "value": "4"},
    {"name": "Archives of the Empire Vol I", "value": "3"},
    {"name": "Winds of Magic", "value": "7"},
    {"name": "Windos of Magic", "value": "7"},
]


def to_source(source_string):
    for pattern in PATTERNS:
        if pattern["name"] in source_string:
            return {pattern["value"]: re.sub(pattern["name"], "", source_string).strip()}


def add_source_from_desc(collection):
    print(f"Updating {collection}")
    no_matches = []
    items = DB[collection].find()
    for item in items:
        if item["owner_id"] == "admin":
            desc = item["description"].strip()
            matches = re.findall(RE, desc)

            print("-----------------------------------------------------")
            print(f"desc: {desc}")
            if matches:
                contents = matches[-1]
                sources_txt = []
                for c, x in enumerate(contents.split(",")):
                    src = x.strip()
                    if c == 0:
                        sources_txt.append(src)
                        continue

                    if src.isdigit():
                        sources_txt[c - 1] = sources_txt[c - 1] + f", {src}"
                        continue

                    sources_txt.append(src)

                print(f"sources: {sources_txt}")
                sources = {}
                for source in sources_txt:
                    sources.update(to_source(source))
                new_desc = re.sub(RE, "", desc).strip()
                DB[collection].find_one_and_update(
                    {"_id": item["_id"]}, {"$set": {"source": sources, "description": new_desc}}
                )
                print(f"numerical: {sources}")
                print(f"new_desc: {new_desc}")
            else:
                no_matches.append(item["name"])
    for c, no_match in enumerate(no_matches):
        print(f"{c} {no_match}")


def add_source():
    print("Updating mutation")
    items = DB["mutation"].find()
    for item in items:
        if item["owner_id"] == "admin":
            if item["type"] == 0:
                source = {"1": "p. 184"}
            elif item["type"] == 1:
                source = {"1": "p. 185"}
            else:
                print(f"Mutation with unknown type {item['name']}")
                return
            # print(f"Updating mutation {item['name']} with {source}")
            DB["mutation"].find_one_and_update({"_id": item["_id"]}, {"$set": {"source": source}})


def add_common_source(collection, name_source_lst):
    print(f"Updating {collection}")
    items = DB[collection].find()
    for item in items:
        if item["owner_id"] == "admin":
            for name_source in name_source_lst:
                if item["name"] == name_source["name"]:
                    print(f"updating {item['_id']} {name_source['name']} with {name_source['source']}")
                    DB[collection].find_one_and_update(
                        {"_id": item["_id"]}, {"$set": {"source": name_source["source"]}}
                    )
                    continue


def check_source(collection):
    print(f"Checking {collection}")
    items = DB[collection].find()
    no_matches = []
    for item in items:
        if item["owner_id"] == "admin":
            if item["source"] == {}:
                no_matches.append(item["name"])
    print("No matches for:")
    for c, no_match in enumerate(sorted(no_matches)):
        print(f"{c} {no_match}")


if __name__ == "__main__":
    # add_source_from_desc("property")
    # add_source_from_desc("spell")
    # add_source()
    # check_source("career")
    # add_source_from_desc("skill")
    # check_source("skill")
    # add_source_from_desc("talent")
    # check_source("talent")
    # add_common_source(
    #     "talent",
    #     [
    #         {"name": "Accurate Shot", "source": {"1": "p. 132"}},
    #         {"name": "Acute Sense", "source": {"1": "p. 132"}},
    #         {"name": "Acute Sense - Hearing", "source": {"1": "p. 132"}},
    #         {"name": "Acute Sense - Sight", "source": {"1": "p. 132"}},
    #         {"name": "Acute Sense - Smell", "source": {"1": "p. 132"}},
    #         {"name": "Acute Sense - Taste", "source": {"1": "p. 132"}},
    #         {"name": "Acute Sense - Taste or Touch", "source": {"1": "p. 132"}},
    #         {"name": "Acute Sense - Touch", "source": {"1": "p. 132"}},
    #         {"name": "Aethyric Attunement", "source": {"1": "p. 132"}},
    #         {"name": "Alley Cat", "source": {"1": "p. 132"}},
    #         {"name": "Ambidextrous", "source": {"1": "p. 132"}},
    #         {"name": "Animal Affinity", "source": {"1": "p. 133"}},
    #         {"name": "Arcane Magic", "source": {"1": "p. 133"}},
    #         {"name": "Arcane Magic - Death", "source": {"1": "p. 133"}},
    #         {"name": "Arcane Magic - Demonology", "source": {"1": "p. 133"}},
    #         {"name": "Arcane Magic - Fire", "source": {"1": "p. 133"}},
    #         {"name": "Arcane Magic - Heavens", "source": {"1": "p. 133"}},
    #         {"name": "Arcane Magic - Hedgecraft", "source": {"1": "p. 133"}},
    #         {"name": "Arcane Magic - Life", "source": {"1": "p. 133"}},
    #         {"name": "Arcane Magic - Light", "source": {"1": "p. 133"}},
    #         {"name": "Arcane Magic - Metal", "source": {"1": "p. 133"}},
    #         {"name": "Arcane Magic - Necromancy", "source": {"1": "p. 133"}},
    #         {"name": "Arcane Magic - Shadow", "source": {"1": "p. 133"}},
    #         {"name": "Arcane Magic - Witchcraft", "source": {"1": "p. 133"}},
    #         {"name": "Argumentative", "source": {"1": "p. 133"}},
    #         {"name": "Artistic", "source": {"1": "p. 133"}},
    #         {"name": "Attractive", "source": {"1": "p. 133"}},
    #         {"name": "Battle Rage", "source": {"1": "p. 133"}},
    #         {"name": "Beneath Notice", "source": {"1": "p. 133"}},
    #         {"name": "Berserk Charge", "source": {"1": "p. 133"}},
    #         {"name": "Blather", "source": {"1": "p. 133-134"}},
    #         {"name": "Bless", "source": {"1": "p. 134"}},
    #         {"name": "Bless - Handrich", "source": {"1": "p. 134"}},
    #         {"name": "Bless - Manann", "source": {"1": "p. 134"}},
    #         {"name": "Bless - Morr", "source": {"1": "p. 134"}},
    #         {"name": "Bless - Myrmidia", "source": {"1": "p. 134"}},
    #         {"name": "Bless - Ranald", "source": {"1": "p. 134"}},
    #         {"name": "Bless - Rhya", "source": {"1": "p. 134"}},
    #         {"name": "Bless - Shallya", "source": {"1": "p. 134"}},
    #         {"name": "Bless - Sigmar", "source": {"1": "p. 134"}},
    #         {"name": "Bless - Solkan", "source": {"1": "p. 134"}},
    #         {"name": "Bless - Taal", "source": {"1": "p. 134"}},
    #         {"name": "Bless - Ulric", "source": {"1": "p. 134"}},
    #         {"name": "Bless - Verena", "source": {"1": "p. 134"}},
    #         {"name": "Bookish", "source": {"1": "p. 134"}},
    #         {"name": "Break and Enter", "source": {"1": "p. 134"}},
    #         {"name": "Briber", "source": {"1": "p. 134"}},
    #         {"name": "Cardsharp", "source": {"1": "p. 134"}},
    #         {"name": "Careful Strike", "source": {"1": "p. 134"}},
    #         {"name": "Carouser", "source": {"1": "p. 134"}},
    #         {"name": "Cat-tongued", "source": {"1": "p. 134"}},
    #         {"name": "Catfall", "source": {"1": "p. 134"}},
    #         {"name": "Combat Aware", "source": {"1": "p. 134"}},
    #         {"name": "Combat Master", "source": {"1": "p. 134-1135"}},
    #         {"name": "Combat Reflexes", "source": {"1": "p. 135"}},
    #         {"name": "Commanding Presence", "source": {"1": "p. 135"}},
    #         {"name": "Contortionist", "source": {"1": "p. 135"}},
    #         {"name": "Coolheaded", "source": {"1": "p. 135"}},
    #         {"name": "Crack the Whip", "source": {"1": "p. 135"}},
    #         {"name": "Craftsman", "source": {"1": "p. 135"}},
    #         {"name": "Craftsman - Alchemy", "source": {"1": "p. 135"}},
    #         {"name": "Craftsman - Apothecary", "source": {"1": "p. 135"}},
    #         {"name": "Craftsman - Blacksmith", "source": {"1": "p. 135"}},
    #         {"name": "Craftsman - Blacksmith, Goldsmith, or Engineer", "source": {"1": "p. 135"}},
    #         {"name": "Craftsman - Boatbuilder", "source": {"1": "p. 135"}},
    #         {"name": "Craftsman - Engineer", "source": {"1": "p. 135"}},
    #         {"name": "Craftsman - Explosives", "source": {"1": "p. 135"}},
    #         {"name": "Craftsman - Goldsmith", "source": {"1": "p. 135"}},
    #         {"name": "Craftsman - Herbalist", "source": {"1": "p. 135"}},
    #         {"name": "Criminal", "source": {"1": "p. 135"}},
    #         {"name": "Deadeye Shot", "source": {"1": "p. 135"}},
    #         {"name": "Dealmaker", "source": {"1": "p. 135"}},
    #         {"name": "Detect Artefact", "source": {"1": "p. 135"}},
    #         {"name": "Diceman", "source": {"1": "p. 135-136"}},
    #         {"name": "Dirty Fighting", "source": {"1": "p. 136"}},
    #         {"name": "Disarm", "source": {"1": "p. 136"}},
    #         {"name": "Doomed", "source": {"1": "p. 136"}},
    #         {"name": "Dual Wielder", "source": {"1": "p. 136"}},
    #         {"name": "Embezzle", "source": {"1": "p. 136-137"}},
    #         {"name": "Enclosed Fighter", "source": {"1": "p. 137"}},
    #         {"name": "Fast Hands", "source": {"1": "p. 137"}},
    #         {"name": "Fast Shot", "source": {"1": "p. 137"}},
    #         {"name": "Fearless", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Animals", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Beastmen", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Bounties", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Cavalry", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Chaos", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Criminals", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Everything", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Heretics", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Intruders", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Large Beasts", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Magic Users", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Monsters", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Outlaws", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Rats", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Riverwardens", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Road Wardens", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Skaven", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Undead", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Watchmen", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Witches", "source": {"1": "p. 137"}},
    #         {"name": "Fearless - Wreckers", "source": {"1": "p. 137"}},
    #         {"name": "Feint", "source": {"1": "p. 137"}},
    #         {"name": "Field Dressing", "source": {"1": "p. 138"}},
    #         {"name": "Fisherman", "source": {"1": "p. 138"}},
    #         {"name": "Flagellant", "source": {"1": "p. 138"}},
    #         {"name": "Fleet Footed", "source": {"1": "p. 138"}},
    #         {"name": "Frenzy", "source": {"1": "p. 138"}},
    #         {"name": "Frightening", "source": {"1": "p. 138"}},
    #         {"name": "Furious Assault", "source": {"1": "p. 138"}},
    #         {"name": "Gregarious", "source": {"1": "p. 138"}},
    #         {"name": "Hardy", "source": {"1": "p. 138"}},
    #         {"name": "Hatred", "source": {"1": "p. 138"}},
    #         {"name": "Hatred - Chaos", "source": {"1": "p. 138"}},
    #         {"name": "Hatred - Greenskins", "source": {"1": "p. 138"}},
    #         {"name": "Hatred - Heretics", "source": {"1": "p. 138"}},
    #         {"name": "Hatred - Outlaws", "source": {"1": "p. 138"}},
    #         {"name": "Hatred - Undead", "source": {"1": "p. 138"}},
    #         {"name": "Holy Hatred", "source": {"1": "p. 138"}},
    #         {"name": "Holy Visions", "source": {"1": "p. 138"}},
    #         {"name": "Hunter’s Eye", "source": {"1": "p. 139-139"}},
    #         {"name": "Impassioned Zeal", "source": {"1": "p. 139"}},
    #         {"name": "Implacable", "source": {"1": "p. 139"}},
    #         {"name": "In-fighter", "source": {"1": "p. 139"}},
    #         {"name": "Inspiring", "source": {"1": "p. 139"}},
    #         {"name": "Instinctive Diction", "source": {"1": "p. 139"}},
    #         {"name": "Invoke", "source": {"1": "p. 139"}},
    #         {"name": "Invoke - Handrich", "source": {"1": "p. 139"}},
    #         {"name": "Invoke - Manann", "source": {"1": "p. 139"}},
    #         {"name": "Invoke - Morr", "source": {"1": "p. 139"}},
    #         {"name": "Invoke - Myrmidia", "source": {"1": "p. 139"}},
    #         {"name": "Invoke - Ranald", "source": {"1": "p. 139"}},
    #         {"name": "Invoke - Rhya", "source": {"1": "p. 139"}},
    #         {"name": "Invoke - Shallya", "source": {"1": "p. 139"}},
    #         {"name": "Invoke - Sigmar", "source": {"1": "p. 139"}},
    #         {"name": "Invoke - Solkan", "source": {"1": "p. 139"}},
    #         {"name": "Invoke - Taal", "source": {"1": "p. 139"}},
    #         {"name": "Invoke - Ulric", "source": {"1": "p. 139"}},
    #         {"name": "Invoke - Verena", "source": {"1": "p. 139"}},
    #         {"name": "Iron Jaw", "source": {"1": "p. 139"}},
    #         {"name": "Iron Will", "source": {"1": "p. 140"}},
    #         {"name": "Jump Up", "source": {"1": "p. 140"}},
    #         {"name": "Kingpin", "source": {"1": "p. 140"}},
    #         {"name": "Lightning Reflexes", "source": {"1": "p. 140"}},
    #         {"name": "Linguistics", "source": {"1": "p. 140"}},
    #         {"name": "Lip Reading", "source": {"1": "p. 140"}},
    #         {"name": "Luck", "source": {"1": "p. 140"}},
    #         {"name": "Magic Resistance", "source": {"1": "p. 140"}},
    #         {"name": "Magical Sense", "source": {"1": "p. 140"}},
    #         {"name": "Magnum Opus", "source": {"1": "p. 140"}},
    #         {"name": "Marksman", "source": {"1": "p. 140"}},
    #         {"name": "Master Orator", "source": {"1": "p. 140"}},
    #         {"name": "Master of Disguise", "source": {"1": "p. 140"}},
    #         {"name": "Menacing", "source": {"1": "p. 140"}},
    #         {"name": "Mimic", "source": {"1": "p. 141"}},
    #         {"name": "Night Vision", "source": {"1": "p. 141"}},
    #         {"name": "Nimble Fingered", "source": {"1": "p. 141"}},
    #         {"name": "Noble Blood", "source": {"1": "p. 141"}},
    #         {"name": "Nose for Trouble", "source": {"1": "p. 141"}},
    #         {"name": "Numismatics", "source": {"1": "p. 141"}},
    #         {"name": "Old Salt", "source": {"1": "p. 141"}},
    #         {"name": "Orientation", "source": {"1": "p. 141"}},
    #         {"name": "Panhandle", "source": {"1": "p. 141"}},
    #         {"name": "Perfect Pitch", "source": {"1": "p. 142"}},
    #         {"name": "Petty Magic", "source": {"1": "p. 142"}},
    #         {"name": "Pharmacist", "source": {"1": "p. 142"}},
    #         {"name": "Pilot", "source": {"1": "p. 142"}},
    #         {"name": "Public Speaker", "source": {"1": "p. 142"}},
    #         {"name": "Pure Soul", "source": {"1": "p. 142"}},
    #         {"name": "Reaction Strike", "source": {"1": "p. 142"}},
    #         {"name": "Read/Write", "source": {"1": "p. 142"}},
    #         {"name": "Resistance", "source": {"1": "p. 142"}},
    #         {"name": "Resistance - Chaos", "source": {"1": "p. 142"}},
    #         {"name": "Resistance - Disease", "source": {"1": "p. 142"}},
    #         {"name": "Resistance - Poison", "source": {"1": "p. 142"}},
    #         {"name": "Resistance - Poison (Ingested)", "source": {"1": "p. 142", "4": "p. 20"}},
    #         {"name": "Resistance - Poison or Disease", "source": {"1": "p. 142"}},
    #         {"name": "Resolute", "source": {"1": "p. 143"}},
    #         {"name": "Riposte", "source": {"1": "p. 143"}},
    #         {"name": "River Guide", "source": {"1": "p. 143"}},
    #         {"name": "River Guide or Gunner", "source": {"1": "p. 143"}},
    #         {"name": "Robust", "source": {"1": "p. 143"}},
    #         {"name": "Rover", "source": {"1": "p. 143"}},
    #         {"name": "Savant", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Alchemy", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Apothecary", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Dwarf Holds and Routes", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Engineer", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Herbs", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Law", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Local", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Local -  Altdorf", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Local - Moot", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Medicine", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Moot terrain", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Riverways", "source": {"1": "p. 143"}},
    #         {"name": "Savant - Theology", "source": {"1": "p. 143"}},
    #         {"name": "Savvy", "source": {"1": "p. 144"}},
    #         {"name": "Scale Sheer Surface", "source": {"1": "p. 144"}},
    #         {"name": "Schemer", "source": {"1": "p. 144"}},
    #         {"name": "Sea Legs", "source": {"1": "p. 144"}},
    #         {"name": "Seasoned Traveller", "source": {"1": "p. 144"}},
    #         {"name": "Second Sight", "source": {"1": "p. 144"}},
    #         {"name": "Secret Identity", "source": {"1": "p. 144"}},
    #         {"name": "Shadow", "source": {"1": "p. 144"}},
    #         {"name": "Sharp", "source": {"1": "p. 144"}},
    #         {"name": "Sharpshooter", "source": {"1": "p. 145"}},
    #         {"name": "Sixth Sense", "source": {"1": "p. 145"}},
    #         {"name": "Slayer", "source": {"1": "p. 145"}},
    #         {"name": "Small", "source": {"1": "p. 145"}},
    #         {"name": "Sniper", "source": {"1": "p. 145"}},
    #         {"name": "Speedreader", "source": {"1": "p. 145"}},
    #         {"name": "Sprinter", "source": {"1": "p. 145"}},
    #         {"name": "Step Aside", "source": {"1": "p. 145"}},
    #         {"name": "Stone Soup", "source": {"1": "p. 145"}},
    #         {"name": "Stout-hearted", "source": {"1": "p. 145"}},
    #         {"name": "Strider", "source": {"1": "p. 145"}},
    #         {"name": "Strider - Coastal", "source": {"1": "p. 145"}},
    #         {"name": "Strider - Marshes", "source": {"1": "p. 145"}},
    #         {"name": "Strider - Mountains", "source": {"1": "p. 145"}},
    #         {"name": "Strider - Rocky", "source": {"1": "p. 145"}},
    #         {"name": "Strider - Woodlands", "source": {"1": "p. 145"}},
    #         {"name": "Strike Mighty Blow", "source": {"1": "p. 145"}},
    #         {"name": "Strike to Stun", "source": {"1": "p. 146"}},
    #         {"name": "Strong Back", "source": {"1": "p. 146"}},
    #         {"name": "Strong Legs", "source": {"1": "p. 146"}},
    #         {"name": "Strong Swimmer", "source": {"1": "p. 146"}},
    #         {"name": "Strong-minded", "source": {"1": "p. 146"}},
    #         {"name": "Sturdy", "source": {"1": "p. 146"}},
    #         {"name": "Suave", "source": {"1": "p. 146"}},
    #         {"name": "Suffuse With Aqshy", "source": {"7": "p. 186"}},
    #         {"name": "Suffuse with Wind", "source": {"7": "p. 186"}},
    #         {"name": "Suffused With Azyr", "source": {"7": "p. 186"}},
    #         {"name": "Suffused With Chamon", "source": {"7": "p. 186"}},
    #         {"name": "Suffused With Ghur", "source": {"7": "p. 186"}},
    #         {"name": "Suffused With Ghyran", "source": {"7": "p. 186"}},
    #         {"name": "Suffused With Hysh", "source": {"7": "p. 186"}},
    #         {"name": "Suffused With Shyish", "source": {"7": "p. 186"}},
    #         {"name": "Suffused With Ulgu", "source": {"2": "p. 88", "7": "p. 186"}},
    #         {"name": "Super Numerate", "source": {"1": "p. 146"}},
    #         {"name": "Supportive", "source": {"1": "p. 146"}},
    #         {"name": "Sure Shot", "source": {"1": "p. 146"}},
    #         {"name": "Surgery", "source": {"1": "p. 146"}},
    #         {"name": "Tenacious", "source": {"1": "p. 146"}},
    #         {"name": "Tinker", "source": {"1": "p. 146"}},
    #         {"name": "Tower of Memories", "source": {"1": "p. 146-147"}},
    #         {"name": "Trapper", "source": {"1": "p. 147"}},
    #         {"name": "Trick Riding", "source": {"1": "p. 147"}},
    #         {"name": "Tunnel Rat", "source": {"1": "p. 147"}},
    #         {"name": "Unshakeable", "source": {"1": "p. 147"}},
    #         {"name": "Very Resilient", "source": {"1": "p. 147"}},
    #         {"name": "Very Strong", "source": {"1": "p. 147"}},
    #         {"name": "War Leader", "source": {"1": "p. 147"}},
    #         {"name": "War Wizard", "source": {"1": "p. 147"}},
    #         {"name": "Warrior Born", "source": {"1": "p. 147"}},
    #         {"name": "Waterman", "source": {"1": "p. 147"}},
    #         {"name": "Wealthy", "source": {"1": "p. 147"}},
    #         {"name": "Well-prepared", "source": {"1": "p. 147"}},
    #         {"name": "Witch!", "source": {"1": "p. 147"}},
    #     ],
    # )
    # add_source_from_desc("item")
    check_source("item")
