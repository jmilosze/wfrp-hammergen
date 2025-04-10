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
            "name": "Enchant Plant",
            "description": "Imbues a non-magical plant with a permanent magical property. Chose one: Hardy (resistant to poor lighting, dry soil, and adverse temperature conditions), Nourishing (fruits, nuts, roots, or leaves weigh half the normal Encumbrance to satisfy food requirements), and Vessel (a Lesser Daemon, Minor Elemental, or soul can be bound into the plant as if it was a Power Stone).",
            "cn": 4,
            "range": "Touch",
            "target": "1 plant",
            "duration": "Instant",
            "shared": True,
            "source": {
                "40": "p. 81"
            },
            "classification": {
                "type": 4,
                "labels": [4, 6]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Lesser Banishment",
            "description": "Banishes a Ghost, Spectre, Lesser Daemon, or Daemonic Beast. If you win an Opposed Willpower/Cool Test, the target is sent back to the spirit-realm or Realm of Chaos from which it originated.",
            "cn": 4,
            "range": "Willpower yards",
            "target": "1",
            "duration": "Instant",
            "shared": True,
            "source": {
                "40": "p. 81"
            },
            "classification": {
                "type": 4,
                "labels": [5, 1]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Magic Alarm",
            "description": "Designate monitoring area. Become aware of any creature or spirit Size Tiny or larger enters the alarmed area. If you are sleeping, it wakes you up.",
            "cn": 5,
            "range": "Willpower Bonus yards",
            "target": "AoE (Initiative Bonus yards)",
            "duration": "Willpower Bonus hours",
            "shared": True,
            "source": {
                "40": "p. 82"
            },
            "classification": {
                "type": 4,
                "labels": [3, 7]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Masking the Mind",
            "description": "Conceal your thoughts and emotions. Intuition and mind-reading or scrying spell Tests against you are Very Hard (-30).",
            "cn": 4,
            "range": "You",
            "target": "You",
            "duration": "Willpower Bonus hours",
            "shared": True,
            "source": {
                "40": "p. 82"
            },
            "classification": {
                "type": 4,
                "labels": [1, 7]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Purify Body",
            "description": "After passing a Challenging (+0) Endurance Test, you can cure the target of one disease or extract one poison. If you Fumble the Test, you contract the disease or poison yourself.",
            "cn": 6,
            "range": "Touch",
            "target": "1",
            "duration": "Instant",
            "shared": True,
            "source": {
                "40": "p. 82"
            },
            "classification": {
                "type": 4,
                "labels": [4, 5]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Speak with Animal",
            "description": "You communicate with an animal. Characters who know Anoqeyin can attempt an Average (+20) Language (Magick) Test to understand the exchange. While the spell is active, you can use Charm Skill on the target animal (instead of Charm Animal Skill).",
            "cn": 3,
            "range": "Willpower Bonus yards",
            "target": "1",
            "duration": "Intelligence minutes",
            "shared": True,
            "source": {
                "40": "p. 82"
            },
            "classification": {
                "type": 4,
                "labels": [0, 3]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Voice of Iron",
            "description": "Your words magically command attention and respect. Normal or shouted speech carries for triple its natural range and provides a +10 bonus to Intimidation and Leadership Tests. The bonus is lost if listeners pass a Difficult (-10) Perception Test to notice the unnatural cadences in your voice.",
            "cn": 4,
            "range": "You",
            "target": "You",
            "duration": "Fellowship minutes",
            "shared": True,
            "source": {
                "40": "p. 82"
            },
            "classification": {
                "type": 4,
                "labels": [2, 6]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Zone of Comfort",
            "description": "Shield yourself against insects and weather. Tiny and Little creatures with the Swarm Trait cannot attack you. You are immune to the effects of Cold and Heat Exposure and receive 1 Damage less from cold-based and heat-based attacks.",
            "cn": 2,
            "range": "You",
            "target": "You",
            "duration": "Willpower Bonus hours",
            "shared": True,
            "source": {
                "40": "p. 82"
            },
            "classification": {
                "type": 4,
                "labels": [0, 2]
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
