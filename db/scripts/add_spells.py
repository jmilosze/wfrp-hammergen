import os

import pymongo

# Get MongoDB connection details from environment variables
mongo_uri = os.environ.get("MONGO_URI")
db_name = os.environ.get("DB_NAME")

# Connect to MongoDB
client = pymongo.MongoClient(mongo_uri)
db = client[db_name]
spell_collection = db["spell"]

# Sample spells to insert

spells = [
    {
        "ownerid": "admin",
        "object": {
            "name": "Bless Arrow",
            "description": "Infuses a non-magical arrow with arcane energy. The enchanted arrow counts as magical and gains +1 to Damage.",
            "cn": 0,
            "range": "Touch",
            "target": "1 arrow",
            "duration": "Willpower Bonus Rounds",
            "shared": True,
            "source": {
                "40": "p. 80"
            },
            "classification": {
                "type": 1,
                "labels": []
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Calm",
            "description": "Induces tranquility and mental peace in the target. Removes any Prejudice, Animosity, Fear, or Frenzy effects if you succeed on a Challenging (+0) Fellowship Test.",
            "cn": 0,
            "range": "Touch",
            "target": "1",
            "duration": "Instant",
            "shared": True,
            "source": {
                "40": "p. 80"
            },
            "classification": {
                "type": 1,
                "labels": []
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Greenfinger",
            "description": "Accelerates plant growth and vitality through your touch. Affected plants grow to their maximum size and productivity at their natural pace, even in poor growing conditions. Dead plants return to life within a day, restoring them to their previous living state.",
            "cn": 0,
            "range": "Touch",
            "target": "AoE (Willpower Bonus yards)",
            "duration": "Instant",
            "shared": True,
            "source": {
                "40": "p. 80"
            },
            "classification": {
                "type": 1,
                "labels": []
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Identify Disease",
            "description": "Channels diagnostic wisdom to identify ailments. The spell reveals the names and effects of any diseases affecting a person, plant, or animal within your touch range.",
            "cn": 0,
            "range": "Touch",
            "target": "1",
            "duration": "Instant",
            "shared": True,
            "source": {
                "40": "p. 81"
            },
            "classification": {
                "type": 1,
                "labels": []
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Remove Dirt",
            "description": "Causes dirt and grime to fall away from the touched target, leaving objects, people, or animals perfectly clean. When cast on a surface, cleans an area with radius equal to your Willpower Bonus yards.",
            "cn": 0,
            "range": "Touch",
            "target": "1 or AoE (Willpower Bonus yards)",
            "duration": "Instant",
            "shared": True,
            "source": {
                "40": "p. 81"
            },
            "classification": {
                "type": 1,
                "labels": []
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Reveal Magic",
            "description": "Makes magical energies visible in your vicinity. Magical objects and creatures within range glow brightly enough to be seen, even if hidden.",
            "cn": 0,
            "range": "You",
            "target": "AoE (Willpower Bonus yards)",
            "duration": "Willpower Bonus Rounds",
            "shared": True,
            "source": {
                "40": "p. 81"
            },
            "classification": {
                "type": 1,
                "labels": []
            }
        },
    },
]


# Function to insert spells
def insert_spells(spells_list):
    # Count existing documents in the collection
    existing_count = spell_collection.count_documents({})
    print(f"Collection currently has {existing_count} documents.")

    # Insert spells
    result = spell_collection.insert_many(spells_list)

    # Print results
    print(f"Successfully inserted {len(result.inserted_ids)} spells.")
    print(f"Inserted IDs: {result.inserted_ids}")

    # Count documents after insertion
    new_count = spell_collection.count_documents({})
    print(f"Collection now has {new_count} documents.")


# Execute the insertion function
if __name__ == "__main__":
    try:
        insert_spells(spells)
        print("Spell insertion completed successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Close the MongoDB connection
        client.close()
        print("MongoDB connection closed.")
