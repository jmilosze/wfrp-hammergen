import enum
import os

from pymongo import MongoClient


def generate(db):
    collection = db.other
    collection_item = db.item

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
    all_items = list(collection_item.find({"ownerid": "admin"}))
    for item_name in item_names:
        item_id = None
        for item in all_items:
            if item["object"]["name"] == item_name and item["ownerid"] == "admin":
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
            "equipped": {iids["Clothing"]: "1", iids["Dagger"]: "1", iids["Sling Bag"]: "1"},
            "carried": {iids["Pouch"]: "1", iids["Writing Kit"]: "1", iids["Parchment"]: "1d10"},
        },
        str(CareerCass.BURGHERS.value): {
            "equipped": {
                iids["Cloak"]: "1",
                iids["Clothing"]: "1",
                iids["Dagger"]: "1",
                iids["Hat"]: "1",
                iids["Sling Bag"]: "1",
                iids["Pouch"]: "1",
            },
            "carried": {iids["Lunch"]: "1"},
        },
        str(CareerCass.COURTIER.value): {
            "equipped": {iids["Dagger"]: "1", iids["Fine Clothing"]: "1"},
            "carried": {iids["Pouch"]: "1", iids["Tweezers"]: "1", iids["Ear Pick"]: "1", iids["Comb"]: "1"},
        },
        str(CareerCass.PEASANT.value): {
            "equipped": {
                iids["Cloak"]: "1",
                iids["Clothing"]: "1",
                iids["Dagger"]: "1",
                iids["Sling Bag"]: "1",
                iids["Pouch"]: "1",
            },
            "carried": {iids["Rations - 1 day"]: "1"},
        },
        str(CareerCass.RANGER.value): {
            "equipped": {
                iids["Cloak"]: "1",
                iids["Clothing"]: "1",
                iids["Dagger"]: "1",
                iids["Backpack"]: "1",
                iids["Pouch"]: "1",
            },
            "carried": {
                iids["Tinderbox"]: "1",
                iids["Blanket"]: "1",
                iids["Rations - 1 day"]: "1",
            },
        },
        str(CareerCass.RIVERFOLK.value): {
            "equipped": {
                iids["Cloak"]: "1",
                iids["Clothing"]: "1",
                iids["Dagger"]: "1",
                iids["Sling Bag"]: "1",
                iids["Pouch"]: "1",
            },
            "carried": {iids["Flask of Spirits"]: "1"},
        },
        str(CareerCass.ROGUE.value): {
            "equipped": {
                iids["Cloak"]: "1",
                iids["Clothing"]: "1",
                iids["Dagger"]: "1",
                iids["Sling Bag"]: "1",
                iids["Hood"] + "," + iids["Mask"]: "1",
                iids["Pouch"]: "1",
            },
            "carried": {
                iids["Candle"]: "2",
                iids["Match"]: "1d10",
            },
        },
        str(CareerCass.WARRIOR.value): {
            "equipped": {
                iids["Clothing"]: "1",
                iids["Hand Weapon"]: "1",
                iids["Dagger"]: "1",
                iids["Pouch"]: "1",
            },
            "carried": {},
        },
        str(CareerCass.SEAFARER.value): {
            "equipped": {
                iids["Cloak"]: "1",
                iids["Clothing"]: "1",
                iids["Dagger"]: "1",
                iids["Pouch"]: "1",
                iids["Sling Bag"]: "1",
            },
            "carried": {
                iids["Rope - 10 yards"]: "1",
                iids["Flask of Spirits"]: "1",
            },
        },
    }

    collection.update_one({"name": "generationProps"}, {"$set": {"classItems": class_items}}, upsert=True)


if __name__ == "__main__":
    MONGO_URI = os.environ["MONGO_URI"]
    SOURCE_DB_NAME = os.environ["DB_NAME"]
    TARGET_DB_NAME = f"{SOURCE_DB_NAME}-go"

    TARGET_DB = MongoClient(MONGO_URI, 27017).get_database(name=TARGET_DB_NAME)

    generate(TARGET_DB)
