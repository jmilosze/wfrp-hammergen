from pymongo import MongoClient

pswd = ""
db = "test"

conn_string = f"mongodb+srv://Jacek:{pswd}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority"
client = MongoClient(conn_string, 27017)

non_char_collections = ["career", "item", "mutation", "property", "skill", "spell", "talent"]

for element in non_char_collections:
    print(f"processing {element}")
    collection = client.__getattr__(db).__getattr__(element)
    items = collection.find()
    for item in items:
        if not item.get("shared"):
            collection.find_one_and_update({"_id": item["_id"]}, {"$set": {"shared": True}})


collection = client.__getattr__(db).character
items = collection.find()
for item in items:
    query = {"$set": {}}
    if not item.get("shared"):
        query["$set"]["shared"] = False

    if not item.get("spells"):
        query["$set"]["spells"] = []

    if not item.get("mutations"):
        query["$set"]["mutations"] = []

    if not item.get("sin"):
        query["$set"]["sin"] = 0

    if not item.get("corruption"):
        query["$set"]["corruption"] = 0

    if query["$set"]:
        collection.find_one_and_update({"_id": item["_id"]}, query)

collection = client.__getattr__(db).user
items = collection.find()
for item in items:
    query = {"$set": {}}
    if not item.get("shared_accounts"):
        query["$set"]["shared_accounts"] = []

    if query["$set"]:
        collection.find_one_and_update({"_id": item["_id"]}, query)
