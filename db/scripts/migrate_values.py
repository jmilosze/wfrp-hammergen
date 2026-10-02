#!/usr/bin/env python3
"""
Merges public creature traits and qualities/flaws that differ only by a value (plan P4, docs/5e/plans/p4-values.md).

  Ward 8, Ward 9, Ward 10        -> Ward (hasValue), referenced as {id, value: "8"} etc.
  Hatred - Elves                 -> Hatred (hasValue), referenced as {id, value: "Elves"}

Steps:
  1. Character traits and item qualities/flaws (all owners, all editions) become [{id, value}] references;
     references to a family's documents point to the family's base document with the value from the old name.
  2. Each family's base document gets the family name, hasValue and a generic description (4e variant);
     sources and applicableTo are merged from all documents of the family.
  3. The other documents of each family are deleted.

Idempotent: converted references are left as they are and merged families are skipped.
Aborts without writing if a family document is missing, not public, renamed, or has a 5e variant.
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

VISIBILITY_PUBLIC = 2
BREATH = (
    "For 2 Advantage activate Breath Free Attack. Target 1 opponent within 20+TB yards. All characters within SB yards "
    "and all characters on the path to the target are struck. Perform an Opposed Ballistic Skill/Dodge Test against all "
    "affected targets. Whoever fails, takes Rating Damage.\n"
)


def family(collection, name, description, members):
    """members: (id, current 4e name, value); the first member becomes the base document."""
    return {"collection": collection, "name": name, "description": description, "members": members}


FAMILIES = [
    # Traits, by rating
    family("trait", "Armour", "Extra Rating AP on all Hit Locations.", [
        ("67053a1049960d000188c3a9", "Armour 1", "1"),
    ]),
    family("trait", "Bite", "Can spend 1 Advantage to make a Free Attack inflicting Rating Damage (no extra Strength Bonus).", [
        ("6708d70949960d000105db29", "Bite 1", "1"),
    ]),
    family("trait", "Breath Cold", BREATH + "Cold effect: Targets gain a Stunned Condition for every full 5 Wounds suffered (minimum of 1).", [
        ("6708fa0d49960d000161ceb6", "Breath Cold 1", "1"),
    ]),
    family("trait", "Breath Corrosion", BREATH + "Corrosion effect: Armour and Weapons carried by affected targets suffer 1 Damage.", [
        ("6708fb8049960d000161ceb7", "Breath Corrosion 1", "1"),
    ]),
    family("trait", "Breath Electricity", BREATH + "Electricity effect: This attack ignores APs. Affected targets gain Stunned Condition.", [
        ("6708fc3649960d000161ceb9", "Breath Electricity 1", "1"),
    ]),
    family("trait", "Breath Fire", BREATH + "Fire effect: This attack ignores APs. Affected targets gain Ablaze Condition.", [
        ("6708fbe749960d000161ceb8", "Breath Fire 1", "1"),
    ]),
    family("trait", "Breath Poison", BREATH + "Poison effect: This attack ignores APs. Affected targets gain Poisoned Condition.", [
        ("6708fc5749960d000161ceba", "Breath Poison 1", "1"),
    ]),
    family("trait", "Breath Smoke", BREATH + "Smoke effect: The area fills with smoke, blocking Line of Sight for TB Rounds.", [
        ("6708fcc349960d000161cebb", "Breath Smoke 1", "1"),
    ]),
    family("trait", "Breath Warpfire", BREATH + "Warpfire effect: details in Empire in Ruins Companion p. 21.", [
        ("6712c8fe49960d00018528db", "Breath Warpfire 1", "1"),
    ]),
    family("trait", "Burrow", "Creature can move by tunneling underground up to Rating yards. See detailed rules in Imperial Zoo p. 23", [
        ("6712043249960d000139252d", "Burrow 30", "30"),
    ]),
    family("trait", "Fear", "Causes Fear with the given Rating in other creatures.", [
        ("670a42bc49960d00012d5ed9", "Fear 1", "1"),
    ]),
    family("trait", "Flight", "The creature can fly up to Rating yards (as a Move). When flying, it gets -20 penalty to all ranged combat. See detailed rules in WFRP p. 339", [
        ("670a42f649960d00012d5eda", "Flight 10", "10"),
    ]),
    family("trait", "Grim", "At the beginning of the turn, if its current Advantage is less than Rating and it is not Surprised, Unconscious, or Entangled, its Advantage increases to Rating. If using the Group Advantage rules from Up in Arms, the creature generates Advantage for the Adversary Advantage Pool.", [
        ("670abecd49960d0001ea796a", "Grim 1", "1"),
    ]),
    family("trait", "Horns", "When the creature has Advantage for Charging, it may make a Free Attack with its Horns and deal Rating Damage (without adding SB).", [
        ("670ae5eb49960d00019d253b", "Horns 1", "1"),
    ]),
    family("trait", "Magic Resistance", "Reduces SL of any spell affecting the creature by Rating.", [
        ("670ae7f649960d00019d2544", "Magic Resistance 1", "1"),
    ]),
    family("trait", "Many Heads", "The creature has multiple heads (the value is their number). A head Critical Wound that stuns, kills, or knocks the creature unconscious takes effect only when all heads are disabled or similarly incapacitated. The creature gains free attacks equal to its number of healthy heads using any Bite, Horns, or Tongue Traits it has. It gains +2 SL to Perception Tests while possessing at least two healthy heads.", [
        ("6a95e3cc49960d00010acbb9", "Many Heads 5", "5"),
    ]),
    family("trait", "Ranged", "Creature has a ranged weapon that deals Rating Damage.", [
        ("670c098c49960d00016b0204", "Ranged 1", "1"),
    ]),
    family("trait", "Tail Attack", "For 1 Advantage, the creature attacks with its tail as Free Attack. Does Rating Damage. If the opponent is smaller and suffers at least 1 Wound, it also gains a Prone Condition.", [
        ("670e9b3f49960d0001b9beb3", "Tail Attack 1", "1"),
    ]),
    family("trait", "Tentacles", "The value gives the number of tentacles and, in brackets, their Damage, e.g. 2 (1). The creature gains one Free Attack Action per tentacle, which does that Damage. If the tentacle attack causes at least 1 Wound, the target receives Entangled Condition. To resolve Grapple, use tentacle's Free Attack Action.", [
        ("670e9ccf49960d0001b9beb4", "2 Tentacle 1", "2 (1)"),
    ]),
    family("trait", "Terror", "The creature causes Terror with the given Rating.", [
        ("670e9e8649960d0001b9beb6", "Terror 1", "1"),
    ]),
    family("trait", "Tongue Attack", "The value gives the Damage and, in brackets, the range in yards, e.g. 1 (5). For 1 Advantage, the creature makes a Free Attack with that Damage and range. If the target is hit, it receives 1 Entangled Condition. If the opponent is smaller it is also dragged towards the creature. In this case, the creature can either release it, Grapple, or do a Free Attack using its Weapon Trait.", [
        ("671175dd49960d0001cb3e37", "Tongue Attack 1 (5)", "1 (5)"),
    ]),
    family("trait", "Ward", "Roll 1d10 after any blow. If the creature rolls Rating or higher, it ignores all Damage.", [
        ("67117c6149960d0001cb3e40", "Ward 10", "10"),
        ("6a95e66549960d00010acbbc", "Ward 9", "9"),
        ("6a95e67749960d00010acbbd", "Ward 8", "8"),
    ]),
    family("trait", "Weapon", "Creature can make melee attacks that cause Rating Damage (already includes SB).", [
        ("6712029949960d000139252b", "Weapon 5", "5"),
    ]),
    family("trait", "Web", "On every successful hit, the opponent receives 1 Entangled Condition with strength equal to Rating.", [
        ("671202e949960d000139252c", "Web 1", "1"),
    ]),
    # Traits, by target
    family("trait", "Afraid", "Creature has Fear - 0 towards the target given as the value.", [
        ("66c7879249960d000155cf03", "Afraid - Elves", "Elves"),
    ]),
    family("trait", "Animosity", "Creature does not like the target given as the value.", [
        ("670539a049960d000188c3a8", "Animosity - Elves", "Elves"),
    ]),
    family("trait", "Blessed", "Creature can enact Blessings of the deity given as the value.", [
        ("6708d81449960d000105db2a", "Blessed - Rhya", "Rhya"),
    ]),
    family("trait", "Corruption", "Creature is a source of Corruption with the strength given as the value.", [
        ("670a3e6049960d00012d5ecf", "Corruption 1", "1"),
    ]),
    family("trait", "Disease", "The creature has the disease given as the value.", [
        ("670a412e49960d00012d5ed4", "Disease - The Black Plague", "The Black Plague"),
    ]),
    family("trait", "Hatred", "Creature hates the target given as the value.", [
        ("670ac07049960d0001ea796c", "Hatred - Elves", "Elves"),
    ]),
    family("trait", "Immunity", "This creature is completely immune to Damage of the type given as the value.", [
        ("670ae6f349960d00019d253e", "Immunity Fire", "Fire"),
        ("670ae6b249960d00019d253d", "Immunity Poision", "Poison"),
    ]),
    family("trait", "Miracles", "Creature can enact Miracles of the deity given as the value.", [
        ("670ae87149960d00019d2546", "Miracles - Rhya", "Rhya"),
    ]),
    family("trait", "Prejudice", "Creature does not like the target given as the value.", [
        ("670c093c49960d00016b0203", "Prejudice - Elves", "Elves"),
    ]),
    family("trait", "Spellcaster", "Creature can cast spells from the Lore given as the value.", [
        ("670e92f049960d0001b9bea6", "Spellcaster - Lore of Fire", "Lore of Fire"),
    ]),
    family("trait", "Venom", "When the creature causes any Wound, the target receives 1 Poisoned Condition that requires an Endurance Test of the difficulty given as the value to remove.", [
        ("6711798c49960d0001cb3e3d", "Venom Challenging", "Challenging"),
    ]),
    # Qualities and flaws
    family("property", "Blast", "All Characters within Rating yards of the struck target point take SL+Weapon Damage, and suffer any Conditions the weapon inflicts.", [
        ("5cdb084c2218c71f3493c091", "Blast 1", "1"),
        ("5cebd5a2e1eba33c449de81f", "Blast 2", "2"),
        ("5cebd592e1eba33c449de81e", "Blast 3", "3"),
        ("5d190a836b4ccf7bc010990e", "Blast 4", "4"),
        ("5d18fb92eeb0ed74f060f69a", "Blast 5", "5"),
    ]),
    family("property", "Crewed", "Weapon is so large and complex it has to be operated by Rating characters (with relevant skill). When operated with less than that, it doubles its Reload Rating.", [
        ("670a4c6a49960d00012d5edc", "Crewed 2", "2"),
    ]),
    family("property", "Durable", "The item can take +Rating Damage points before it suffers any negatives and gains a saving throw of (10 - Rating)+ on a 1d10 roll against instant breakage.", [
        ("5c44dce24e09bc1980c8b024", "Durable 1", "1"),
        ("67dda2d749960d0001be2d0f", "Durable 2", "2"),
        ("67dda2e349960d0001be2d10", "Durable 3", "3"),
        ("67180ded49960d0001f4573e", "Durable 4", "4"),
    ]),
    family("property", "Experimental", "User needs to pass a Challenging (+0) Trade - Engineering Test for each hour they are using the item. For any doubles rolled on a failure, something breaks. If this happens more than Rating times, the item breaks.", [
        ("652582b549960d00019a7fb4", "Experimental 1", "1"),
        ("652583ea49960d00019a7fb5", "Experimental 2", "2"),
    ]),
    family("property", "Fine", "Meticulously crafted to please the eye. This Quality is a sign of social status and can be taken multiple times (the value is how many). The higher the quality, the more impressive it seems.", [
        ("5c3b3bf9e274765500371903", "Fine 1", "1"),
        ("67dda2aa49960d0001be2d0c", "Fine 2", "2"),
        ("67dda2b749960d0001be2d0d", "Fine 3", "3"),
        ("67ddedfb49960d0001be2d28", "Fine 4", "4"),
    ]),
    family("property", "Optional Blast", "If you want to apply the Blast effect with the given Rating, you must expend an additional projectile for each target that would be struck by the attack. Do it before making Attack Test.", [
        ("636fb8bd0c40139be515aff2", "Optional Blast 1", "1"),
    ]),
    family("property", "Reload", "An unloaded weapon with this flaw requires an Extended Ranged Test for the appropriate Weapon Group scoring Rating SL to reload. If interrupted, reloading must be started from the beginning.", [
        ("5cdc7e74bec5e61f602c6d70", "Reload 1", "1"),
        ("5cebd572e1eba33c449de81d", "Reload 2", "2"),
        ("5cebd749e1eba33c449de821", "Reload 3", "3"),
        ("5cec1eb3494e843e34d7dbdf", "Reload 4", "4"),
        ("5cec1c85494e843e34d7dbdd", "Reload 5", "5"),
        ("63b2c55553d94cdc98c7d260", "Reload 6", "6"),
        ("6a9d4e3d49960d0001d1cc25", "Reload 9", "9"),
    ]),
    family("property", "Reload Increase", "Increases weapon's reload SL by Rating.", [
        ("63b3596753d94cdc98c7d278", "Reload +1", "1"),
        ("63b3597853d94cdc98c7d279", "Reload +2", "2"),
    ]),
    family("property", "Repeater", "The weapon holds Rating shots, automatically reloading each time after firing. After all shots are fired, the weapon must be reloaded using standard rules. If Rating is a roll (e.g. 1d10), generate this number the first time you fire after reloading.", [
        ("5cdb25c0bec5e61f602c6d68", "Repeater 2", "2"),
        ("671c0fc449960d0001e00233", "Repeater 3", "3"),
        ("5cec1cb8494e843e34d7dbde", "Repeater 4", "4"),
        ("6519d77f49960d00016cb95d", "Repeater 1d10", "1d10"),
    ]),
    family("property", "Salvo", "This weapon can be fired Rating times before it needs to be reloaded. When shooting, you can chose how many shots to fire. Each shot after the first suffers -10 to its Ranged Test. Each shot reduces Salvo by 1. Each successful Reload increases Salvo by 1, up to its maximum Rating. If a Dwarf Salvo weapon Misfires on a 100 roll, the crew suffers a number of hits equal to the remaining Salvo rating.", [
        ("670a4a9c49960d00012d5edb", "Salvo 2", "2"),
    ]),
    family("property", "Shield", "Any time you are opposing an incoming attack (even with your melee weapon and not the shield), you get Rating AP on all locations of your body. With Rating 2 or more, you can also use it to Oppose incoming missile shots in the Line of Sight.", [
        ("5cdb2c4cbec5e61f602c6d69", "Shield 1", "1"),
        ("5cdb2c87bec5e61f602c6d6a", "Shield 2", "2"),
        ("5cebcc43e1eba33c449de814", "Shield 3", "3"),
        ("63ad8d69422d37bd985bdc7d", "Shield 4", "4"),
        ("63ad8d75422d37bd985bdc7e", "Shield 5", "5"),
    ]),
    family("property", "Slash", "After scoring a Critical Hit, the target takes 1 Bleeding Condition in addition to any other effects of the hit. You may spend Rating Advantage to cause 1 additional Bleeding Condition.", [
        ("63ac526ace4942a1e6b20279", "Slash (1A)", "1"),
        ("63ac528fce4942a1e6b2027a", "Slash (2A)", "2"),
    ]),
    family("property", "Spiderborn", "Attacks with weapon count as Magical and having the Web Creature Trait with the given Rating.", [
        ("6646fe5149960d00019aeda7", "Spiderborn 40", "40"),
        ("6646ff4f49960d00019aeda8", "Spiderborn 50", "50"),
        ("6646ff5249960d00019aeda9", "Spiderborn 60", "60"),
        ("6646ff5449960d00019aedaa", "Spiderborn 70", "70"),
        ("6646ff8549960d00019aedab", "Spiderborn 80", "80"),
    ]),
    family("property", "Spread", "Projectiles can strike additional targets. Effect varies by range, Point Blank: shot targets a single individual, add Rating to Damage. Short to Long Range: Shot targets individual and the next Rating closest visible creatures. No two targets can be more than Rating yards apart. Long Range: Same as for short to Long range but reduce weapon's Damage by Rating.", [
        ("63acaa32a1e7d5e86a06cbb0", "Spread 1", "1"),
        ("63acaa71a8c06089c0a0492a", "Spread 2", "2"),
        ("63acaa82a8c06089c0a0492b", "Spread 3", "3"),
        ("63acaa8ea8c06089c0a0492c", "Spread 4", "4"),
        ("63acaaaaa8c06089c0a0492d", "Spread 5", "5"),
    ]),
    family("property", "Warded", "Gives the wearer the Ward Creature Trait with the given Rating.", [
        ("6646ffaa49960d00019aedac", "Warded 7", "7"),
        ("6646ffe249960d00019aedad", "Warded 8", "8"),
        ("6646ffe449960d00019aedae", "Warded 9", "9"),
    ]),
]


def member_maps():
    """Returns {collection: {member id: (base id, value)}}."""
    maps = {"trait": {}, "property": {}}
    for f in FAMILIES:
        base_id = f["members"][0][0]
        for member_id, _, value in f["members"]:
            maps[f["collection"]][member_id] = (base_id, value)
    return maps


def is_merged(base_doc, f):
    variant = base_doc["editions"].get("4e", {})
    return variant.get("name") == f["name"] and variant.get("hasvalue") is True


def check_families(db):
    """Returns (families to merge, errors)."""
    to_merge, errors = [], []
    for f in FAMILIES:
        coll = db[f["collection"]]
        base_id = f["members"][0][0]
        base_doc = coll.find_one({"_id": ObjectId(base_id)})
        if base_doc is not None and is_merged(base_doc, f):
            leftover = [m[1] for m in f["members"][1:] if coll.find_one({"_id": ObjectId(m[0])}) is not None]
            if leftover:
                errors.append(f"{f['name']}: merged, but documents still exist: {leftover}")
            continue

        docs = []
        for member_id, name, _ in f["members"]:
            doc = coll.find_one({"_id": ObjectId(member_id)})
            if doc is None:
                errors.append(f"{f['name']}: {name} ({member_id}) not found")
                continue
            if doc["visibility"] != VISIBILITY_PUBLIC:
                errors.append(f"{f['name']}: {name} ({member_id}) is not public")
            if set(doc["editions"]) != {"4e"}:
                errors.append(f"{f['name']}: {name} ({member_id}) has editions {sorted(doc['editions'])}, expected 4e only")
                continue
            variant = doc["editions"]["4e"]
            if variant["name"].strip() != name:
                errors.append(f"{f['name']}: {member_id} is named '{variant['name']}', expected '{name}'")
            modifiers = variant.get("modifiers")
            if modifiers and (
                modifiers["size"] or modifiers["movement"] or modifiers["effects"] or any(modifiers["attributes"].values())
            ):
                errors.append(f"{f['name']}: {name} ({member_id}) has modifiers")
            docs.append(doc)

        if f["collection"] == "property" and len({d["editions"]["4e"]["type"] for d in docs}) > 1:
            errors.append(f"{f['name']}: documents mix qualities and flaws")
        to_merge.append((f, docs))
    return to_merge, errors


def convert_references(refs, members):
    """Converts a list of ids (or already converted {id, value}) to [{id, value}], pointing family members to the
    family's base document."""
    result = []
    for ref in refs:
        if isinstance(ref, dict):
            # Already converted: the value was set by the user or by an earlier run.
            result.append({"id": ref["id"], "value": ref["value"]})
        elif ref in members:
            base_id, value = members[ref]
            result.append({"id": base_id, "value": value})
        else:
            result.append({"id": ref, "value": ""})
    return result


def dedupe_by_id(refs):
    seen, result = set(), []
    for ref in refs:
        if ref["id"] not in seen:
            seen.add(ref["id"])
            result.append(ref)
    return result


def plan_references(db, maps):
    """Returns (character updates, item updates, number of item references dropped as duplicates)."""
    character_updates = []
    for doc in db["character"].find({}, {"object.traits": 1}):
        traits = doc["object"].get("traits") or []
        new_traits = convert_references(traits, maps["trait"])
        if new_traits != traits:
            character_updates.append(UpdateOne({"_id": doc["_id"]}, {"$set": {"object.traits": new_traits}}))

    item_updates, dropped = [], 0
    for doc in db["item"].find({}, {"editions": 1}):
        update = {}
        for edition, variant in doc["editions"].items():
            properties = variant.get("properties") or []
            converted = convert_references(properties, maps["property"])
            new_properties = dedupe_by_id(converted)
            dropped += len(converted) - len(new_properties)
            if new_properties != properties:
                update[f"editions.{edition}.properties"] = new_properties
        if update:
            item_updates.append(UpdateOne({"_id": doc["_id"]}, {"$set": update}))
    return character_updates, item_updates, dropped


def merge_family(db, f, docs):
    coll = db[f["collection"]]
    base_id = ObjectId(f["members"][0][0])
    source = {}
    for doc in reversed(docs):  # the base document's page wins for a shared source
        source.update(doc["editions"]["4e"].get("source") or {})
    update = {
        "editions.4e.name": f["name"],
        "editions.4e.description": f["description"],
        "editions.4e.hasvalue": True,
        "editions.4e.source": source,
    }
    if f["collection"] == "property":
        applicable = set()
        for doc in docs:
            applicable.update(doc["editions"]["4e"].get("applicableto") or [])
        update["editions.4e.applicableto"] = sorted(applicable)
    coll.update_one({"_id": base_id}, {"$set": update})
    other_ids = [ObjectId(m[0]) for m in f["members"][1:]]
    if other_ids:
        coll.delete_many({"_id": {"$in": other_ids}})


def verify(db, maps):
    errors = []
    removed = {
        "trait": {i for i, (base, _) in maps["trait"].items() if i != base},
        "property": {i for i, (base, _) in maps["property"].items() if i != base},
    }
    for doc in db["character"].find({}, {"object.traits": 1}):
        for ref in doc["object"].get("traits") or []:
            if not isinstance(ref, dict):
                errors.append(f"character {doc['_id']}: unconverted trait reference {ref}")
            elif ref["id"] in removed["trait"]:
                errors.append(f"character {doc['_id']}: reference to removed trait {ref['id']}")
    for doc in db["item"].find({}, {"editions": 1}):
        for edition, variant in doc["editions"].items():
            refs = variant.get("properties") or []
            for ref in refs:
                if not isinstance(ref, dict):
                    errors.append(f"item {doc['_id']} ({edition}): unconverted property reference {ref}")
                elif ref["id"] in removed["property"]:
                    errors.append(f"item {doc['_id']} ({edition}): reference to removed property {ref['id']}")
            if len({r["id"] for r in refs if isinstance(r, dict)}) != len(refs):
                errors.append(f"item {doc['_id']} ({edition}): duplicate property references")
    for f in FAMILIES:
        coll = db[f["collection"]]
        base = coll.find_one({"_id": ObjectId(f["members"][0][0])})
        if base is None or not is_merged(base, f):
            errors.append(f"{f['name']}: base document not merged")
        for member_id, name, _ in f["members"][1:]:
            if coll.find_one({"_id": ObjectId(member_id)}) is not None:
                errors.append(f"{f['name']}: {name} ({member_id}) not deleted")
    return errors


def main():
    parser = argparse.ArgumentParser(description="Merge public traits and qualities/flaws that differ only by a value.")
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
    maps = member_maps()

    print(f"Database: {args.db}")
    to_merge, errors = check_families(db)
    if errors:
        print("\nErrors (nothing was written):", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    print(f"\nFamilies to merge: {len(to_merge)} (already merged: {len(FAMILIES) - len(to_merge)})")
    for f, docs in to_merge:
        members = ", ".join(f"{name} -> {value}" for _, name, value in f["members"])
        print(f"  - {f['collection']:<8} {f['name']}: {members}")

    character_updates, item_updates, dropped = plan_references(db, maps)
    print(f"\nCharacters to convert: {len(character_updates)}")
    print(f"Items to convert: {len(item_updates)} ({dropped} duplicate property reference(s) dropped)")

    if args.dry_run:
        return

    if not to_merge and not character_updates and not item_updates:
        print("\nNothing to migrate.")
    else:
        try:
            confirmation = (
                input(f"\nMigrate '{args.db}'? (type 'yes' to confirm): ")
                .strip()
                .lower()
            )
        except (KeyboardInterrupt, EOFError):
            print("\nAborted by user. No changes were made.")
            sys.exit(0)

        if confirmation != "yes":
            print("Confirmation was not 'yes'. Aborted without making any changes.")
            sys.exit(0)

        print("\nConverting references...")
        if character_updates:
            db["character"].bulk_write(character_updates, ordered=False)
        if item_updates:
            db["item"].bulk_write(item_updates, ordered=False)
        print("Merging families...")
        for f, docs in to_merge:
            merge_family(db, f, docs)

    print("\nVerifying...")
    errors = verify(db, maps)
    if errors:
        print(f"Verification FAILED ({len(errors)} error(s)):", file=sys.stderr)
        for e in errors[:50]:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    print("Verification passed.")


if __name__ == "__main__":
    main()
