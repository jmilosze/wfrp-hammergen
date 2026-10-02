#!/usr/bin/env python3
"""
Renames the traits and qualities/flaws merged by migrate_values.py so that their names show what the value is,
following the 4e rulebook (plan P4, docs/5e/plans/p4-values.md):

  Ward -> Ward (Rating), Hatred -> Hatred (Target)

The UI replaces the bracketed placeholder with the value: Ward (Rating) with value 8 shows as Ward (8).
Also makes Daemonic a trait with a value (Daemonic (Target)) and rewrites the two values that hold two numbers
to use a comma: Tentacles "2 (1)" -> "2, 1", Tongue Attack "1 (5)" -> "1, 5".

Idempotent: renamed entities and rewritten values are skipped.
Aborts without writing if an entity is missing or has neither its expected old name nor its new name.
"""
import argparse
import os
import sys

from bson import ObjectId
from pymongo import MongoClient, UpdateOne

DEFAULT_MONGO_URI = os.environ.get(
    "MONGO_URI", "mongodb://admin:admin@localhost:27017"
)
DEFAULT_DB_NAME = os.environ.get("DB_NAME", "hammergenGo")

TENTACLES_ID = "670e9ccf49960d0001b9beb4"
TONGUE_ATTACK_ID = "671175dd49960d0001cb3e37"

BREATH = (
    "For 2 Advantage activate Breath Free Attack. Target 1 opponent within 20+TB yards. All characters within SB yards "
    "and all characters on the path to the target are struck. Perform an Opposed Ballistic Skill/Dodge Test against all "
    "affected targets. Whoever fails, takes Rating Damage.\n"
)


def rename(collection, id, old_name, new_name, description):
    return {"collection": collection, "id": id, "old": old_name, "new": new_name, "description": description}


RENAMES = [
    # Traits, by rating
    rename("trait", "67053a1049960d000188c3a9", "Armour", "Armour (Rating)",
           "Extra Rating AP on all Hit Locations."),
    rename("trait", "6708d70949960d000105db29", "Bite", "Bite (Rating)",
           "Can spend 1 Advantage to make a Free Attack inflicting Rating Damage (Strength Bonus already included)."),
    rename("trait", "6708fa0d49960d000161ceb6", "Breath Cold", "Breath Cold (Rating)",
           BREATH + "Cold effect: Targets gain a Stunned Condition for every full 5 Wounds suffered (minimum of 1)."),
    rename("trait", "6708fb8049960d000161ceb7", "Breath Corrosion", "Breath Corrosion (Rating)",
           BREATH + "Corrosion effect: Armour and Weapons carried by affected targets suffer 1 Damage."),
    rename("trait", "6708fc3649960d000161ceb9", "Breath Electricity", "Breath Electricity (Rating)",
           BREATH + "Electricity effect: This attack ignores APs. Affected targets gain Stunned Condition."),
    rename("trait", "6708fbe749960d000161ceb8", "Breath Fire", "Breath Fire (Rating)",
           BREATH + "Fire effect: This attack ignores APs. Affected targets gain Ablaze Condition."),
    rename("trait", "6708fc5749960d000161ceba", "Breath Poison", "Breath Poison (Rating)",
           BREATH + "Poison effect: This attack ignores APs. Affected targets gain Poisoned Condition."),
    rename("trait", "6708fcc349960d000161cebb", "Breath Smoke", "Breath Smoke (Rating)",
           BREATH + "Smoke effect: The area fills with smoke, blocking Line of Sight for TB Rounds."),
    rename("trait", "6712c8fe49960d00018528db", "Breath Warpfire", "Breath Warpfire (Rating)",
           BREATH + "Warpfire effect: details in Empire in Ruins Companion p. 21."),
    rename("trait", "6712043249960d000139252d", "Burrow", "Burrow (Rating)",
           "Creature can move by tunneling underground up to Rating yards. See detailed rules in Imperial Zoo p. 23."),
    rename("trait", "670a3fb649960d00012d5ed2", "Daemonic", "Daemonic (Target)",
           "Creature does not require food, drink, air, etc. All its attacks are Magical. Roll 1d10 after any blow; if the roll is equal to or higher than Target, the blow is ignored, even if it is a Critical. When its Wounds are reduced to 0, the creature returns to the Realms of Chaos and is removed from play."),
    rename("trait", "670a42bc49960d00012d5ed9", "Fear", "Fear (Rating)",
           "Causes Fear (Rating) in other creatures."),
    rename("trait", "670a42f649960d00012d5eda", "Flight", "Flight (Rating)",
           "The creature can fly up to Rating yards (as a Move). When flying, it gets -20 penalty to all ranged combat. See detailed rules in WFRP p. 339."),
    rename("trait", "670abecd49960d0001ea796a", "Grim", "Grim (Rating)",
           "At the beginning of the turn, if its current Advantage is less than Rating and it is not Surprised, Unconscious, or Entangled, its Advantage increases to Rating. If using the Group Advantage rules from Up in Arms, the creature generates Advantage for the Adversary Advantage Pool."),
    rename("trait", "670ae5eb49960d00019d253b", "Horns", "Horns (Rating)",
           "When the creature has Advantage for Charging, it may make a Free Attack with its Horns dealing Rating Damage (Strength Bonus already included)."),
    rename("trait", "670ae7f649960d00019d2544", "Magic Resistance", "Magic Resistance (Rating)",
           "Reduces the SL of any spell affecting the creature by Rating."),
    rename("trait", "6a95e3cc49960d00010acbb9", "Many Heads", "Many Heads (Number)",
           "The creature has Number heads. A head Critical Wound that stuns, kills, or knocks the creature unconscious takes effect only when all heads are disabled or similarly incapacitated. The creature gains free attacks equal to its number of healthy heads using any Bite, Horns, or Tongue Traits it has. It gains +2 SL to Perception Tests while possessing at least two healthy heads."),
    rename("trait", "670c098c49960d00016b0204", "Ranged", "Ranged (Rating, Range)",
           "Creature has a ranged weapon that deals Rating Damage, with a range of Range yards."),
    rename("trait", "670e9b3f49960d0001b9beb3", "Tail Attack", "Tail Attack (Rating)",
           "For 1 Advantage, the creature attacks with its tail as Free Attack. Does Rating Damage (Strength Bonus already included). If the opponent is smaller and suffers at least 1 Wound, it also gains a Prone Condition."),
    rename("trait", TENTACLES_ID, "Tentacles", "Tentacles (Number, Rating)",
           "The creature has Number tentacles. It gains one Free Attack Action per tentacle, each doing Rating Damage (Strength Bonus already included). If the tentacle attack causes at least 1 Wound, the target receives Entangled Condition. To resolve Grapple, use tentacle's Free Attack Action."),
    rename("trait", "670e9e8649960d0001b9beb6", "Terror", "Terror (Rating)",
           "The creature causes Terror (Rating)."),
    rename("trait", TONGUE_ATTACK_ID, "Tongue Attack", "Tongue Attack (Rating, Range)",
           "For 1 Advantage, the creature makes a Free Attack that deals Rating Damage with a range of Range yards. If the target is hit, it receives 1 Entangled Condition. If the opponent is smaller it is also dragged towards the creature. In this case, the creature can either release it, Grapple, or do a Free Attack using its Weapon Trait."),
    rename("trait", "67117c6149960d0001cb3e40", "Ward", "Ward (Rating)",
           "Roll 1d10 after any blow. If the creature rolls Rating or higher, it ignores all Damage."),
    rename("trait", "6712029949960d000139252b", "Weapon", "Weapon (Rating)",
           "Creature can make melee attacks that cause Rating Damage (Strength Bonus already included)."),
    rename("trait", "671202e949960d000139252c", "Web", "Web (Rating)",
           "On every successful hit, the opponent receives 1 Entangled Condition with a Strength of Rating."),
    # Traits, by target
    rename("trait", "66c7879249960d000155cf03", "Afraid", "Afraid (Target)",
           "The creature has Fear (0) of the Target."),
    rename("trait", "670539a049960d000188c3a8", "Animosity", "Animosity (Target)",
           "The creature dislikes the Target."),
    rename("trait", "6708d81449960d000105db2a", "Blessed", "Blessed (Deity)",
           "The creature can enact Blessings of the Deity."),
    rename("trait", "670a3e6049960d00012d5ecf", "Corruption", "Corruption (Strength)",
           "The creature is a source of Corruption of the given Strength."),
    rename("trait", "670a412e49960d00012d5ed4", "Disease", "Disease (Type)",
           "The creature carries the disease of the given Type."),
    rename("trait", "670ac07049960d0001ea796c", "Hatred", "Hatred (Target)",
           "The creature hates the Target."),
    rename("trait", "670ae6f349960d00019d253e", "Immunity", "Immunity (Type)",
           "The creature is completely immune to Damage of the given Type, including from Critical Wounds."),
    rename("trait", "670ae87149960d00019d2546", "Miracles", "Miracles (Deity)",
           "The creature can enact Miracles of the Deity."),
    rename("trait", "670c093c49960d00016b0203", "Prejudice", "Prejudice (Target)",
           "The creature is prejudiced against the Target."),
    rename("trait", "670e92f049960d0001b9bea6", "Spellcaster", "Spellcaster (Lore)",
           "The creature can cast spells from the Lore."),
    rename("trait", "6711798c49960d0001cb3e3d", "Venom", "Venom (Difficulty)",
           "When the creature causes any Wound, the target receives 1 Poisoned Condition; the Endurance Test to remove it has the given Difficulty."),
    # Qualities and flaws: descriptions already refer to Rating
    rename("property", "5cdb084c2218c71f3493c091", "Blast", "Blast (Rating)", None),
    rename("property", "670a4c6a49960d00012d5edc", "Crewed", "Crewed (Rating)", None),
    rename("property", "5c44dce24e09bc1980c8b024", "Durable", "Durable (Rating)", None),
    rename("property", "652582b549960d00019a7fb4", "Experimental", "Experimental (Rating)", None),
    rename("property", "5c3b3bf9e274765500371903", "Fine", "Fine (Rating)",
           "Meticulously crafted to please the eye. This Quality is a sign of social status and can be taken multiple times (Rating is how many). The higher the quality, the more impressive it seems."),
    rename("property", "636fb8bd0c40139be515aff2", "Optional Blast", "Optional Blast (Rating)",
           "If you want to apply the Blast (Rating) effect, you must expend an additional projectile for each target that would be struck by the attack. Do it before making Attack Test."),
    rename("property", "5cdc7e74bec5e61f602c6d70", "Reload", "Reload (Rating)", None),
    rename("property", "63b3596753d94cdc98c7d278", "Reload Increase", "Reload Increase (Rating)", None),
    rename("property", "5cdb25c0bec5e61f602c6d68", "Repeater", "Repeater (Rating)", None),
    rename("property", "670a4a9c49960d00012d5edb", "Salvo", "Salvo (Rating)", None),
    rename("property", "5cdb2c4cbec5e61f602c6d69", "Shield", "Shield (Rating)", None),
    rename("property", "63ac526ace4942a1e6b20279", "Slash", "Slash (Rating)", None),
    rename("property", "6646fe5149960d00019aeda7", "Spiderborn", "Spiderborn (Rating)",
           "Attacks with weapon count as Magical and having the Web (Rating) Creature Trait."),
    rename("property", "63acaa32a1e7d5e86a06cbb0", "Spread", "Spread (Rating)", None),
    rename("property", "6646ffaa49960d00019aedac", "Warded", "Warded (Rating)",
           "Gives the wearer the Ward (Rating) Creature Trait."),
]

# Values holding two numbers use a comma, so that they read well in the name: Tentacles (2, 1).
VALUE_REWRITES = {
    (TENTACLES_ID, "2 (1)"): "2, 1",
    (TONGUE_ATTACK_ID, "1 (5)"): "1, 5",
}


def plan_renames(db):
    """Returns (renames to apply, number already done, errors)."""
    to_apply, done, errors = [], 0, []
    for r in RENAMES:
        doc = db[r["collection"]].find_one({"_id": ObjectId(r["id"])})
        if doc is None:
            errors.append(f"{r['old']} ({r['id']}) not found")
            continue
        variant = doc["editions"].get("4e")
        if variant is None:
            errors.append(f"{r['old']} ({r['id']}) has no 4e variant")
            continue
        name = variant["name"].strip()
        if name == r["new"]:
            done += 1
        elif name == r["old"]:
            to_apply.append(r)
        else:
            errors.append(f"{r['id']} is named '{name}', expected '{r['old']}' or '{r['new']}'")
    return to_apply, done, errors


def rewrite_value(ref):
    return VALUE_REWRITES.get((ref["id"], ref["value"]), ref["value"])


def plan_value_rewrites(db):
    updates = []
    for doc in db["character"].find({"object.traits.id": {"$in": [i for i, _ in VALUE_REWRITES]}}, {"object.traits": 1}):
        traits = doc["object"]["traits"]
        new_traits = [{"id": t["id"], "value": rewrite_value(t)} for t in traits]
        if new_traits != traits:
            updates.append(UpdateOne({"_id": doc["_id"]}, {"$set": {"object.traits": new_traits}}))
    return updates


def apply_renames(db, renames):
    for r in renames:
        update = {"editions.4e.name": r["new"], "editions.4e.hasvalue": True}
        if r["description"] is not None:
            update["editions.4e.description"] = r["description"]
        db[r["collection"]].update_one({"_id": ObjectId(r["id"])}, {"$set": update})


def main():
    parser = argparse.ArgumentParser(description="Rename traits and qualities/flaws with values, e.g. Ward -> Ward (Rating).")
    parser.add_argument(
        "--uri",
        default=DEFAULT_MONGO_URI,
        help="MongoDB URI (defaults to MONGO_URI env var or mongodb://admin:admin@localhost:27017)",
    )
    parser.add_argument(
        "--db",
        default=DEFAULT_DB_NAME,
        help="Database name (defaults to DB_NAME env var or hammergenGo)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Only print what would change, make no changes",
    )
    args = parser.parse_args()

    db = MongoClient(args.uri)[args.db]
    print(f"Database: {args.db}")

    renames, done, errors = plan_renames(db)
    if errors:
        print("\nErrors (nothing was written):", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    value_updates = plan_value_rewrites(db)

    print(f"\nRenames: {len(renames)} (already renamed: {done})")
    for r in renames:
        description = "" if r["description"] is None else ", new description"
        print(f"  - {r['collection']:<8} {r['old']} -> {r['new']}{description}")
    print(f"\nCharacters with values to rewrite ({', '.join(f'{o} -> {n}' for (_, o), n in VALUE_REWRITES.items())}): {len(value_updates)}")

    if args.dry_run:
        return

    if not renames and not value_updates:
        print("\nNothing to do.")
        return

    try:
        confirmation = input(f"\nApply to '{args.db}'? (type 'yes' to confirm): ").strip().lower()
    except (KeyboardInterrupt, EOFError):
        print("\nAborted by user. No changes were made.")
        sys.exit(0)

    if confirmation != "yes":
        print("Confirmation was not 'yes'. Aborted without making any changes.")
        sys.exit(0)

    if value_updates:
        db["character"].bulk_write(value_updates, ordered=False)
    apply_renames(db, renames)

    print("\nVerifying...")
    renames, done, errors = plan_renames(db)
    value_updates = plan_value_rewrites(db)
    if renames or errors or value_updates:
        print(f"Verification FAILED: {len(renames)} rename(s) and {len(value_updates)} value rewrite(s) left", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)
    print(f"Verification passed: {done} renamed.")


if __name__ == "__main__":
    main()
