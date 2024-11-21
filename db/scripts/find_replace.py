import os

from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

DB = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)


def find_in_items(id):
    equipped = []
    carried = []
    stored = []
    chars = DB["character"].find()
    for char in chars:
        for item in char["equipped_items"]:
            if item["id"] == id:
                equipped.append(char["name"])
                break
        for item in char["carried_items"]:
            if item["id"] == id:
                carried.append(char["name"])
                break

        for item in char["stored_items"]:
            if item["id"] == id:
                stored.append(char["name"])
                break

    print(f"characters with equipped: {equipped}")
    print(f"characters with carried: {carried}")
    print(f"characters with stored: {stored}")


def check_characters():
    not_converted = []
    chars = DB["character"].find()
    for char in chars:
        if not isinstance(char["species"], str):
            not_converted.append(char["name"])

    print(f"not converted characters: {not_converted}")


def find_in_spells(id):
    spells = []
    chars = DB["character"].find()
    for char in chars:
        for item in char["object"]["spells"]:
            if item == id:
                spells.append(char["object"]["name"])
                break

    print(f"characters with spell: {spells}")


def find_property(id):
    properties = []
    items = DB["item"].find()
    for item in items:
        for property in item["object"]["properties"]:
            if property == id:
                properties.append(item["object"]["name"])
                break

    print(f"items with property: {properties}")


def find_talents_in_characters(id):
    used = []
    chars = DB["character"].find()
    for char in chars:
        for talent in char["object"]["talents"]:
            if talent["id"] == id:
                used.append(char["object"]["name"])
                break
    print(f"characters with skill: {used}")


def find_and_replace_properties_in_items(id_pairs):
    for id_pair in id_pairs:
        items = list(DB["item"].find())
        prop_id = id_pair["prop_id"]
        rune_id = id_pair["rune_id"]
        used = []
        for item in items:
            found = False
            for property in item["object"]["properties"]:
                if property == prop_id:
                    used.append({"property_id": prop_id,
                                 "name": item["object"]["name"],
                                 "id": str(item["_id"]),
                                 "owner": item["ownerid"]})
                    found = True
                    break
            if found:
                new_properties = list(item["object"]["properties"])
                new_properties.remove(prop_id)
                new_runes = list(item["object"]["runes"]) if "runes" in item["object"] else []
                new_runes.append({"id": rune_id, "number": 1})
                print(f'Updating {item["object"]["name"]}, item_id: {item["_id"]}, property_id: {prop_id}')
                print(f'Old properties: {item["object"]["properties"]}')
                print(f'New properties: {new_properties}')
                print(f'New runes: {new_runes}')
                DB["item"].find_one_and_update({"_id": item["_id"]}, {"$set": {"object.properties": new_properties, "object.runes": new_runes}})
    return


if __name__ == "__main__":
    find_and_replace_properties_in_items([
        {"prop_id": "6520381d49960d0001346ebe", "rune_id": "6737a65b49960d000106de96"},  # Rune of Clear Seeing
        {"prop_id": "6520395449960d0001346ec2", "rune_id": "6738679549960d00017aac68"},
        {"prop_id": "651e966849960d00017d8750", "rune_id": "673626b449960d0001998c59"},
        {"prop_id": "651e967449960d00017d8751", "rune_id": "6739c2ff49960d0001005681"},
        {"prop_id": "6550cfc649960d00016b3aea", "rune_id": "6739c31249960d0001005682"},
        {"prop_id": "652038a249960d0001346ebf", "rune_id": "6736293649960d0001998c5d"},
        {"prop_id": "651e96e049960d00017d8752", "rune_id": "673a0a6649960d00010cc678"},
        {"prop_id": "651e974749960d00017d8753", "rune_id": "673a0b7549960d00010cc679"},
        {"prop_id": "652038fc49960d0001346ec0", "rune_id": "6736298249960d0001998c5e"},
        {"prop_id": "651e97c749960d00017d8754", "rune_id": "673a0ba449960d00010cc67a"},
    ])
