import os
import re

from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

db = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)
collection = db.spell


def get_classification_from_description(desc):
    spell_type = 0
    labels = []
    new_desc = desc

    patterns = [
        {"pattern": r"^Ritual[,.]", "type": 3, "label": [1001]},
        {"pattern": r"^(The |Any )?Lore of Beasts\.", "type": 3, "label": [0]},
        {"pattern": r"^(The |Any )?Lore of Death\.", "type": 3, "label": [1]},
        {"pattern": r"^(The |Any )?Lore of Fire\.", "type": 3, "label": [2]},
        {"pattern": r"^(The |Any )?Lore of Heavens\.", "type": 3, "label": [3]},
        {"pattern": r"^(The |Any )?Lore of Life\.", "type": 3, "label": [4]},
        {"pattern": r"^(The |Any )?Lore of Light\.", "type": 3, "label": [5]},
        {"pattern": r"^(The |Any )?Lore of Metal\.", "type": 3, "label": [6]},
        {"pattern": r"^(The |Any )?Lore of Shadows\.", "type": 3, "label": [7]},

        {"pattern": r"^(The |Any )?Lore of Daemonology\.", "type": 3, "label": [8]},
        {"pattern": r"^(The |Any )?Lore of Necromancy\.", "type": 3, "label": [9]},
        {"pattern": r"^(The |Any )?Lore of Hedgecraft\.", "type": 3, "label": [10]},
        {"pattern": r"^(The |Any )?Lore of Witchcraft\.", "type": 3, "label": [11]},
        {"pattern": r"^(The |Any )?Lore of Nurgle\.", "type": 3, "label": [12]},
        {"pattern": r"^(The |Any )?Lore of Slaanesh\.", "type": 3, "label": [13]},
        {"pattern": r"^(The |Any )?Lore of Tzeentch\.", "type": 3, "label": [14]},
        {"pattern": r"^General High Magic Spell\.", "type": 3, "label": [15]},
        {"pattern": r"^Slann High Magic Spell\.", "type": 3, "label": [16]},
        {"pattern": r"^The Lore of Little WAAAGH!", "type": 3, "label": [17]},
        {"pattern": r"^The Lore of Little Waaagh!", "type": 3, "label": [18]},
        {"pattern": r"^The Lore of Plague \(Skaven\) Spell\.", "type": 3, "label": [19]},
        {"pattern": r"^The Lore of Ruin \(Skaven\) Spell\.", "type": 3, "label": [20]},
        {"pattern": r"^The Lore of Stealth \(Skaven\) Spell\.", "type": 3, "label": [21]},
        {"pattern": r"^The Lore of The Great Maw\.", "type": 3, "label": [22]},

        {"pattern": r"^Chaos Arcane Spell\.", "type": 2, "label": [1003]},
        {"pattern": r"^Skaven Arcane Spell\.", "type": 2, "label": [1002]},
        {"pattern": r"^Arcane Spell\.", "type": 2, "label": []},

        {"pattern": r"^Petty Spell of (Tzeentch|Slaanesh)\.", "type": 1, "label": [1003]},
        {"pattern": r"^Skaven Petty Spell\.", "type": 1, "label": [1002]},
        {"pattern": r"^Petty Spell\.", "type": 1, "label": []},
    ]

    for pattern in patterns:
        if re.match(pattern["pattern"], new_desc):
            spell_type = pattern["type"]
            labels = labels + pattern["label"]
            new_desc = re.sub(pattern["pattern"], "", new_desc).strip()

    return {"type": spell_type, "labels": labels}, new_desc


spells = collection.find({"ownerid": "admin"})
for spell in spells:
    new_classification, new_desc = get_classification_from_description(spell["object"]["description"])
    collection.find_one_and_update({"_id": spell["_id"]}, {
        "$set": {"object.classification": new_classification, "object.description": new_desc}})

spells = collection.find({"ownerid": {"$ne": "admin"}})
for spell in spells:
    collection.find_one_and_update({"_id": spell["_id"]},
                                   {"$set": {"object.classification": {"type": 0, "labels": []}}})
