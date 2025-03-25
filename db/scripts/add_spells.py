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
            "name": "Deadlock",
            "description": "Nullifies enemy spellcasting by creating a droning resonance of anti-magic. Target's spells are temporarily negated while weapons and armor function normally. Special overcasting rules apply.",
            "cn": 5,
            "range": "Half Toughness yards",
            "target": "1 spellcaster, spell, or item",
            "duration": "Willpower Bonus minutes",
            "shared": True,
            "source": {
                "40": "p. 87"
            },
            "classification": {
                "type": 3,
                "labels": [15]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Fiery Convocation",
            "description": "Summons barrage of fire hitting all creatures in Area of Effect. Magic missile hit with Damage +5 and inflicts Ablaze Condition, which causes damage and Ablaze condition each round. Special overcasting rules apply.",
            "cn": 10,
            "range": "Willpower yards",
            "target": "AoE (Willpower Bonus yards)",
            "duration": "Willpower Bonus Rounds",
            "shared": True,
            "source": {
                "40": "p. 87"
            },
            "classification": {
                "type": 3,
                "labels": [15]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Drain Magic",
            "description": "Expels magic from the world by conjuring an aethyric vortex. Persistent spells in Area of Effect are immediately dispelled and accumulated magic is lost. Magic items and Hard Creature Traits unaffected. Special overcasting rules apply.",
            "cn": 6,
            "range": "Half Willpower yards",
            "target": "AoE (Willpower Bonus yards)",
            "duration": "Instant",
            "shared": True,
            "source": {
                "40": "p. 87"
            },
            "classification": {
                "type": 3,
                "labels": [15]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Fortune is Fickle",
            "description": "Summons invisible spirits to distract a spellcaster. Doubles rolled on Channelling or Casting Tests cause a Miscast regardless of talents or ingredients. Casting Tests cannot cause Criticals and Dispelling fails on if they roll  doubles. Characters with Second Sight can perceive the spirits. Special overcasting rules apply.",
            "cn": 6,
            "range": "Fellowship yards",
            "target": "1",
            "duration": "Fellowship Bonus Rounds",
            "shared": True,
            "source": {
                "40": "p. 87"
            },
            "classification": {
                "type": 3,
                "labels": [15]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Glamour of Teclis",
            "description": "Conjures illusory maze of mist and shadows. Targets must pass Very Hard (-30) Navigation Test or wander randomly. If a target fails 3 Tests and you pass an Average (+20) Leadership Test, you may control directions of targets. Special overcasting rules apply.",
            "cn": 7,
            "range": "Willpower yards",
            "target": "AoE (Intelligence Bonus yards)",
            "duration": "Intelligence Bonus Rounds",
            "shared": True,
            "source": {
                "40": "p. 88"
            },
            "classification": {
                "type": 3,
                "labels": [15]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Hand of Glory",
            "description": "Invokes legendary Elven heroes to guide allies. Targets temporarily gain 3d10 to Weapon Skill, Ballistic Skill, Strength, Toughness, Initiative, or Agility, or Movement increased by 2. Special overcasting rules apply.",
            "cn": 4,
            "range": "You",
            "target": "AoE (Fellowship Bonus yards)",
            "duration": "1 Round",
            "shared": True,
            "source": {
                "40": "p. 88"
            },
            "classification": {
                "type": 3,
                "labels": [15]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Greater Banishment",
            "description": "Radiates streams of pure Qhaysh to banish evil. Daemonic and Undead creatures suffer magic missile damage +8 (or +15 for Size Large). Creatures with Undead trait suffer double damage. Destroyed Daemons cannot return for 1,001 days. Destroyed Undead can never be resummoned. Additionally, you can make a free Dispelling attempt against every Witchcraft, Daemonology, Necromancy, Dark Magic, or Chaos spell within the Area of Effect Special overcasting rules apply.",
            "cn": 14,
            "range": "You",
            "target": "AoE (Half Willpower yards)",
            "duration": "1 Round",
            "shared": True,
            "source": {
                "40": "p. 88"
            },
            "classification": {
                "type": 3,
                "labels": [15]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Invisible Eye",
            "description": "Creates an invisible floating eyeball that moves at command. Has Perception, Magick language talent, Sight, and Flight 120 trait. Can be destroyed if detected (3 Wounds). If destroyed, caster suffers from Surprised condition. Special overcasting rules apply.",
            "cn": 4,
            "range": "Intelligence Bonus yards",
            "target": "Special",
            "duration": "Intelligence Bonus hours",
            "shared": True,
            "source": {
                "40": "p. 88"
            },
            "classification": {
                "type": 3,
                "labels": [15]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Shield of Saphery",
            "description": "Summons glittering protective field around allies. Friendly targets gain the Ward 9+ Creature Trait. Each High Magic spell improves the Ward trait by 1. Special overcasting rules apply.",
            "cn": 4,
            "range": "You",
            "target": "AoE (Willpower Bonus yards)",
            "duration": "1 Round",
            "shared": True,
            "source": {
                "40": "p. 89"
            },
            "classification": {
                "type": 3,
                "labels": [15]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Soul Quench",
            "description": "Casts streaking lines of white light at foes, banishing souls to afterlife. Deals magic missile damage +6. Slain targets cannot manifest as ghosts or have souls bound into vessels. Special overcasting rules apply.",
            "cn": 7,
            "range": "Half Willpower yards",
            "target": "AoE (Willpower Bonus yards)",
            "duration": "Instant",
            "shared": True,
            "source": {
                "40": "p. 89"
            },
            "classification": {
                "type": 3,
                "labels": [15]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Tempest",
            "description": "Summons polychromatic storm of crackling energy. Moves like random vortex spell (see Winds of Magic p .21) but skips steps 1-2. Creatures in Area of Effect suffer magic missile damage +4 and must pass Average Athletics Test. Flying targets suffer damage +5 and penalties to tests. Special overcasting rules apply.",
            "cn": 8,
            "range": "Willpower yards",
            "target": "AoE (2 x Willpower Bonus yards)",
            "duration": "1 Round",
            "shared": True,
            "source": {
                "40": "p. 89"
            },
            "classification": {
                "type": 3,
                "labels": [15]
            }
        },
    },
    {
        "ownerid": "admin",
        "object": {
            "name": "Walk between Worlds",
            "description": "Opens paths between worlds for allies. Friendly targets gain the Ethereal Creature Trait and doubled Movement scores. Special overcasting rules apply.",
            "cn": 7,
            "range": "Willpower yards",
            "target": "AoE (Willpower Bonus yards)",
            "duration": "1 Round",
            "shared": True,
            "source": {
                "40": "p. 89"
            },
            "classification": {
                "type": 3,
                "labels": [15]
            }
        },
    }
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