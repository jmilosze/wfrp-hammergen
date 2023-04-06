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
    # add_common_source(
    #     "item",
    #     [
    #         {"name": "Abacus", "source": {"1": "p. 303"}},
    #         {"name": "Ale - Keg", "source": {"1": "p. 302"}},
    #         {"name": "Amulet", "source": {"1": "p. 302"}},
    #         {"name": "Animal Trap", "source": {"1": "p. 303"}},
    #         {"name": "Antitoxin Kit", "source": {"1": "p. 303"}},
    #         {"name": "Backpack", "source": {"1": "p. 301"}},
    #         {"name": "Ball", "source": {"1": "p. 308"}},
    #         {"name": "Bandage", "source": {"1": "p. 308"}},
    #         {"name": "Barrel", "source": {"1": "p. 301"}},
    #         {"name": "Baton", "source": {"1": "p. 308"}},
    #         {"name": "Bedroll", "source": {"1": "p. 308"}},
    #         {"name": "Black Lotus", "source": {"1": "p. 306"}},
    #         {"name": "Blanket", "source": {"1": "p. 308"}},
    #         {"name": "Blanket", "source": {"1": "p. 308"}},
    #         {"name": "Bomb", "source": {"1": "p. 295"}},
    #         {"name": "Book - Apothecary", "source": {"1": "p. 304"}},
    #         {"name": "Book - Art", "source": {"1": "p. 304"}},
    #         {"name": "Book - Blank", "source": {"1": ""}},
    #         {"name": "Book - Cryptography", "source": {"1": "p. 304"}},
    #         {"name": "Book - Engineer", "source": {"1": "p. 304"}},
    #         {"name": "Book - Law", "source": {"1": "p. 304"}},
    #         {"name": "Book - Magic", "source": {"1": "p. 304"}},
    #         {"name": "Book - Medicine", "source": {"1": "p. 304"}},
    #         {"name": "Book - Religion", "source": {"1": "p. 304"}},
    #         {"name": "Boots", "source": {"1": "p. 302"}},
    #         {"name": "Bowl", "source": {"1": "p. 308"}},
    #         {"name": "Broom", "source": {"1": "p. 303"}},
    #         {"name": "Bucket", "source": {"1": "p. 303"}},
    #         {"name": "Candle", "source": {"1": "p. 308"}},
    #         {"name": "Canvas Tarp", "source": {"1": "p. 308"}},
    #         {"name": "Cask", "source": {"1": "p. 301"}},
    #         {"name": "Chalk", "source": {"1": "p. 308"}},
    #         {"name": "Charcoal Stick", "source": {"1": "p. 308"}},
    #         {"name": "Chisel", "source": {"1": "p. 303"}},
    #         {"name": "Clothing", "source": {"1": "p. 302"}},
    #         {"name": "Quality Clothing", "source": {"1": ""}},
    #         {"name": "Coat", "source": {"1": "p. 302"}},
    #         {"name": "Comb", "source": {"1": "p. 303"}},
    #         {"name": "Commission Papers", "source": {"1": ""}},
    #         {"name": "Cooking Pot", "source": {"1": "p. 308"}},
    #         {"name": "Costume", "source": {"1": "p. 302"}},
    #         {"name": "Courtly Garb", "source": {"1": "p. 302"}},
    #         {"name": "Courtly Garb (Servant)", "source": {"1": "p. 302"}},
    #         {"name": "Crowbar", "source": {"1": "p. 303"}},
    #         {"name": "Crutch", "source": {"1": "p. 303"}},
    #         {"name": "Cup", "source": {"1": "p. 308"}},
    #         {"name": "Cutlery", "source": {"1": "p. 308"}},
    #         {"name": "Davrich Lamp", "source": {"1": "p. 308"}},
    #         {"name": "Deck of Cards", "source": {"1": "p. 308"}},
    #         {"name": "Dice", "source": {"1": "p. 308"}},
    #         {"name": "Digestive Tonic", "source": {"1": "p. 307"}},
    #         {"name": "Disguise Kit", "source": {"1": "p. 303"}},
    #         {"name": "Doll", "source": {"1": "p. 308"}},
    #         {"name": "Ear Pick", "source": {"1": "p. 303"}},
    #         {"name": "Earth Root", "source": {"1": "p. 307"}},
    #         {"name": "Engineering Marvel", "source": {"1": "p. 308"}},
    #         {"name": "Eye Patch", "source": {"1": "p. 308"}},
    #         {"name": "Face powder", "source": {"1": "p. 302"}},
    #         {"name": "False Eye", "source": {"1": "p. 308"}},
    #         {"name": "False Foot", "source": {"1": "p. 308"}},
    #         {"name": "False Leg", "source": {"1": "p. 308"}},
    #         {"name": "Faxtoryll", "source": {"1": "p. 307"}},
    #         {"name": "Fine Clothing", "source": {"1": ""}},
    #         {"name": "Fish Hook", "source": {"1": "p. 303"}},
    #         {"name": "Flask", "source": {"1": "p. 301"}},
    #         {"name": "Flask of Spirits", "source": {"1": ""}},
    #         {"name": "Floor Brush", "source": {"1": "p. 303"}},
    #         {"name": "Gavel", "source": {"1": "p. 303"}},
    #         {"name": "Gilded Nose", "source": {"1": "p. 308"}},
    #         {"name": "Gloves", "source": {"1": "p. 302"}},
    #         {"name": "Grappling Hook", "source": {"1": "p. 308"}},
    #         {"name": "Guild License", "source": {"1": ""}},
    #         {"name": "Hammer", "source": {"1": "p. 303"}},
    #         {"name": "Hand Weapon", "source": {"1": "p. 294"}},
    #         {"name": "Hat", "source": {"1": "p. 302"}},
    #         {"name": "Healing Draught", "source": {"1": "p. 307"}},
    #         {"name": "Healing Poultice", "source": {"1": "p. 307"}},
    #         {"name": "Heartkill", "source": {"1": "p. 304"}},
    #         {"name": "Hoe", "source": {"1": "p. 303"}},
    #         {"name": "Hood", "source": {"1": "p. 302"}},
    #         {"name": "Hooded Cloak", "source": {"1": ""}},
    #         {"name": "Hook", "source": {"1": "p. 308"}},
    #         {"name": "Incendiary", "source": {"1": "p. 295"}},
    #         {"name": "Instrument - Large", "source": {"1": "p. 308"}},
    #         {"name": "Instrument - Medium", "source": {"1": "p. 308"}},
    #         {"name": "Instrument - Small", "source": {"1": "p. 308"}},
    #         {"name": "Jug", "source": {"1": "p. 301"}},
    #         {"name": "Key", "source": {"1": "p. 303"}},
    #         {"name": "Lamp Oil", "source": {"1": "p. 308"}},
    #         {"name": "Lantern", "source": {"1": "p. 308"}},
    #         {"name": "Leaflet", "source": {"1": "p. 304"}},
    #         {"name": "Legal Document", "source": {"1": "p. 304"}},
    #         {"name": "Lock Picks", "source": {"1": "p. 303"}},
    #         {"name": "Lunch", "source": {"1": ""}},
    #         {"name": "Mad Cap Mushrooms", "source": {"1": "p. 304"}},
    #         {"name": "Manacles", "source": {"1": "p. 303"}},
    #         {"name": "Mandrake Root", "source": {"1": "p. 304"}},
    #         {"name": "Map", "source": {"1": "p. 304"}},
    #         {"name": "Mask", "source": {"1": "p. 302"}},
    #         {"name": "Match", "source": {"1": "p. 308"}},
    #         {"name": "Match", "source": {"1": "p. 308"}},
    #         {"name": "Moonflower", "source": {"1": "p. 304"}},
    #         {"name": "Mop", "source": {"1": "p. 303"}},
    #         {"name": "Nail", "source": {"1": "p. 303"}},
    #         {"name": "Nightshade", "source": {"1": "p. 307"}},
    #         {"name": "Paint Brush", "source": {"1": "p. 303"}},
    #         {"name": "Pan", "source": {"1": "p. 308"}},
    #         {"name": "Parchment", "source": {"1": "p. 304"}},
    #         {"name": "Perfume", "source": {"1": "p. 302"}},
    #         {"name": "Pestle & Mortar", "source": {"1": "p. 303"}},
    #         {"name": "Pewter Stein", "source": {"1": "p. 301"}},
    #         {"name": "Pin", "source": {"1": "p. 302"}},
    #         {"name": "Pipe and Tobacco", "source": {"1": "p. 308"}},
    #         {"name": "Placard", "source": {"1": "p. 308"}},
    #         {"name": "Plate", "source": {"1": "p. 308"}},
    #         {"name": "Pole (3 yards)", "source": {"1": "p. 303"}},
    #         {"name": "Pouch", "source": {"1": "p. 301"}},
    #         {"name": "Quill Pen", "source": {"1": "p. 303"}},
    #         {"name": "Rags", "source": {"1": "p. 308"}},
    #         {"name": "Rake", "source": {"1": "p. 303"}},
    #         {"name": "Ranald’s Delight", "source": {"1": "p. 304"}},
    #         {"name": "Rations - 1 day", "source": {"1": "p. 302"}},
    #         {"name": "Religious Symbol", "source": {"1": "p. 302"}},
    #         {"name": "Robes", "source": {"1": "p. 302"}},
    #         {"name": "Rope - 10 yards", "source": {"1": "p. 308"}},
    #         {"name": "Sack", "source": {"1": "p. 301"}},
    #         {"name": "Sack - Large", "source": {"1": "p. 301"}},
    #         {"name": "Saddlebags", "source": {"1": "p. 301"}},
    #         {"name": "Salwort", "source": {"1": "p. 307"}},
    #         {"name": "Saw", "source": {"1": "p. 303"}},
    #         {"name": "Sceptre", "source": {"1": "p. 302"}},
    #         {"name": "Scroll Case", "source": {"1": "p. 301"}},
    #         {"name": "Shoes", "source": {"1": "p. 302"}},
    #         {"name": "Sickle", "source": {"1": "p. 303"}},
    #         {"name": "Signet Ring", "source": {"1": "p. 302"}},
    #         {"name": "Sling Bag", "source": {"1": "p. 301"}},
    #         {"name": "Spade", "source": {"1": "p. 303"}},
    #         {"name": "Spike", "source": {"1": "p. 303"}},
    #         {"name": "Spit", "source": {"1": "p. 304"}},
    #         {"name": "Stamp - Engraved", "source": {"1": "p. 303"}},
    #         {"name": "Storm Lantern", "source": {"1": "p. 308"}},
    #         {"name": "Tent - Large", "source": {"1": "p. 308"}},
    #         {"name": "Tent - Medium", "source": {"1": "p. 308"}},
    #         {"name": "Tent - Small", "source": {"1": "p. 308"}},
    #         {"name": "Tinderbox", "source": {"1": "p. 308"}},
    #         {"name": "Tongs - Steel", "source": {"1": "p. 303"}},
    #         {"name": "Trade Tools - Artisan", "source": {"1": "p. 305"}},
    #         {"name": "Trade Tools - Artist", "source": {"1": "p. 305"}},
    #         {"name": "Trade Tools - Engineer", "source": {"1": "p. 305"}},
    #         {"name": "Trade Tools - Herbalist", "source": {"1": "p. 305"}},
    #         {"name": "Trade Tools - Navigator", "source": {"1": "p. 305"}},
    #         {"name": "Trade Tools - Physician", "source": {"1": "p. 305"}},
    #         {"name": "Trade Tools - Apothecary", "source": {"1": "p. 305"}},
    #         {"name": "Tweezers", "source": {"1": "p. 303"}},
    #         {"name": "Uniform", "source": {"1": "p. 302"}},
    #         {"name": "Vitality Draught", "source": {"1": "p. 307"}},
    #         {"name": "Walking Cane", "source": {"1": "p. 302"}},
    #         {"name": "Waterskin", "source": {"1": "p. 301"}},
    #         {"name": "Weirdroot", "source": {"1": "p. 304"}},
    #         {"name": "Wine - bottle", "source": {"1": "p. 302"}},
    #         {"name": "Wooden teeth", "source": {"1": "p. 308"}},
    #         {"name": "Workshop - Apothecary", "source": {"1": "p. 305"}},
    #         {"name": "Workshop - Apothecary - Large", "source": {"1": "p. 305"}},
    #         {"name": "Workshop - Artisan", "source": {"1": "p. 305"}},
    #         {"name": "Workshop - Artist", "source": {"1": "p. 305"}},
    #         {"name": "Workshop - Engineer", "source": {"1": "p. 305"}},
    #         {"name": "Workshop - Herbalist", "source": {"1": "p. 305"}},
    #         {"name": "Workshop - Physician", "source": {"1": "p. 305"}},
    #         {"name": "Writing Kit", "source": {"1": "p. 303"}},
    #     ],
    # )
