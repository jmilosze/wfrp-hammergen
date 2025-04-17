import os
import json
from pymongo import MongoClient
from bson import ObjectId

MONGO_URI = os.environ["MONGO_URI"]
DB_NAME = os.environ["DB_NAME"]

db = MongoClient(MONGO_URI, 27017).get_database(name=DB_NAME)
collection = db.career

# Helper class to handle ObjectId serialization
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

# Function to update a single career document
def update_career_document(career):
    # Add "exists": true to all existing level fields
    for level in ["level1", "level2", "level3", "level4"]:
        if level in career["object"]:
            career["object"][level]["exists"] = True

    # Add level5 with the specified structure
    career["object"]["level5"] = {
        "exists": False,
        "name": "",
        "status": 0,
        "standing": 0,
        "attributes": [],
        "skills": [],
        "talents": [],
        "items": ""
    }

    return career

# Option 1: Update a single document (from the example provided)
def update_single_document():
    # Parse the example document
    example_doc = json.loads("""
    {"_id":{"$oid":"6325abd85fc54a8b2a7efba7"},"ownerid":"5fca97de7e674494cfa6c5aa","object":{"name":"Chaos marauder","description":"","shared":true,"source":{"0":""},"species":[{"$numberInt":"0"}],"level1":{"name":"Grunt","status":{"$numberInt":"0"},"standing":{"$numberInt":"0"},"attributes":[{"$numberInt":"1"},{"$numberInt":"4"},{"$numberInt":"6"}],"skills":["5f5e914f807c850c3dcd01b8","5ce3027f97b74e3c4cebdbbd","5cadc5d8828dc9389cc7b158","5ce303c497b74e3c4cebdbbf","5cea546f0bf34d4a646aa970","5ce47042099f0c36546bddde","5ce842173ec45d1a88e3323c","5ce984f11140dc34041696a0"],"talents":["5d18c7017209656444284f53","5cec2eec488ae64fb84c0484","5ce9b0b1c831083940ff5846","5cea99b6ba626c52981c279e"],"items":""},"level2":{"name":"Marauder","status":{"$numberInt":"0"},"standing":{"$numberInt":"0"},"attributes":[{"$numberInt":"1"},{"$numberInt":"4"},{"$numberInt":"2"},{"$numberInt":"6"}],"skills":["5cdfbaf930259922e8ea210a","5cdf464330259922e8ea2109","5cadddb1a48cc24ecc4eca98","5ce841743ec45d1a88e3323a","5ce909163f5a0e36c0a4bab5","5cadd0b9828dc9389cc7b16e","5d17e7026dcd9568649b11d8","5ce8489d3ec45d1a88e33241","5ce302d497b74e3c4cebdbbe"],"talents":["5cea588b0bf34d4a646aa974","5ce6edd39eaf2a1e6c0a5cbc","5ce816dc0cbaa7441c5b994f","5ce8659ce0055a4d2822cb2d","5ce82181b51ee94b1c1dd825","5ce8676ce0055a4d2822cb31"],"items":""},"level3":{"name":"Ravager","status":{"$numberInt":"0"},"standing":{"$numberInt":"0"},"attributes":[{"$numberInt":"1"},{"$numberInt":"2"},{"$numberInt":"3"},{"$numberInt":"4"},{"$numberInt":"6"}],"skills":["5ce114c70f123f1f14a4cc66","5cea891eadaed446d44365e3","5caddae3a48cc24ecc4eca8e","5d068e764c58df585c1bc30b","5ce116570f123f1f14a4cc67"],"talents":["5d18c8a97209656444284f54","5ce855d206ad2230542604e4","5d066fa848a38f3b4c12ef57"],"items":""},"level4":{"name":"Death dealer","status":{"$numberInt":"0"},"standing":{"$numberInt":"0"},"attributes":[{"$numberInt":"1"},{"$numberInt":"2"},{"$numberInt":"3"},{"$numberInt":"4"},{"$numberInt":"6"},{"$numberInt":"9"}],"skills":[],"talents":["5ce8211db51ee94b1c1dd824","5ce96e19fa0e2a2ae876c4f1","5d069f06bbde575820bf30a2"],"items":""},"class":{"$numberInt":"7"}}}
    """)

    # Update the document
    updated_doc = update_career_document(example_doc)

    # Print the updated document
    print(json.dumps(updated_doc, cls=JSONEncoder, indent=2))

    return updated_doc

# Option 2: Update all career documents in the MongoDB collection
def update_mongodb_collection(connection_string, db_name, collection_name):
    # Find all career documents and update them
    cursor = collection.find({})
    for doc in cursor:
        updated_doc = update_career_document(doc)

        # Update in the database
        collection.update_one(
            {"_id": doc["_id"]},
            {"$set": {
                "object.level1.exists": True,
                "object.level2.exists": True,
                "object.level3.exists": True,
                "object.level4.exists": True,
                "object.level5": {
                    "exists": False,
                    "name": "",
                    "status": 0,
                    "standing": 0,
                    "attributes": [],
                    "skills": [],
                    "talents": [],
                    "items": ""
                }
            }}
        )

    print(f"Updated all documents in {db_name}.{collection_name}")

# Main execution
if __name__ == "__main__":
    # Choose which function to run based on your needs

    # Option 1: Update the example document
    update_single_document()

    # Option 2: Update all documents in MongoDB collection
    # Uncomment and configure these lines to use:
    # connection_string = "mongodb://username:password@localhost:27017/"
    # db_name = "your_database"
    # collection_name = "careers"
    # update_mongodb_collection(connection_string, db_name, collection_name)