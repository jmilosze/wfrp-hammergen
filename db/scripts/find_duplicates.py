#!/usr/bin/env python3
import argparse
import os
import sys
from collections import defaultdict
from bson import ObjectId
from bson.errors import InvalidId
from pymongo import MongoClient

DEFAULT_MONGO_URI = os.environ.get(
    "MONGO_URI", "mongodb://admin:admin@localhost:27017"
)
DEFAULT_DB_NAME = os.environ.get("DB_NAME", "hammergenGo")

CORE_COLLECTIONS = [
    "career",
    "character",
    "item",
    "mutation",
    "prayer",
    "property",
    "rune",
    "skill",
    "spell",
    "talent",
    "trait",
]

SOURCES = {
    "0": "Custom",
    "1": "WFRP",
    "2": "Rough Nights & Hard Days",
    "3": "Archives Volume I",
    "4": "Archives Volume II",
    "5": "Archives Volume III",
    "6": "Up in Arms",
    "7": "Winds of Magic",
    "8": "Middenheim",
    "9": "Salzenmund",
    "10": "Sea of Claws",
    "11": "Lustria",
    "12": "Enemy in Shadows Companion",
    "13": "Death on the Reik Companion",
    "14": "Enemy in Shadows",
    "15": "Death on the Reik",
    "16": "Power Behind the Throne",
    "17": "Power Behind the Throne Companion",
    "18": "The Horned Rat",
    "19": "The Horned Rat Companion",
    "20": "Empire in Ruins",
    "21": "Empire in Ruins Companion",
    "22": "The Imperial Zoo",
    "23": "Altdorf Crown of the Empire",
    "24": "Ubersreik Adventures",
    "25": "Ubersreik Adventures 2",
    "26": "Guide to Ubersreik (Starter Set)",
    "27": "Adventure Book (Starter Set)",
    "28": "Ubersreik Adventures 3",
    "29": "Tribes and Tribulations",
    "30": "Reikland Miscellanea",
    "31": "Patrons Of The Old World",
    "32": "Buildings Of The Reikland",
    "33": "One Shots Of The Reikland",
    "34": "Monuments Of The Reikland",
    "35": "Shrines Of Sigmar",
    "36": "Sullasara's Spells",
    "37": "Blood And Bramble",
    "38": "Dwarf Player's Guide",
    "39": "Deft Steps Light Fingers",
    "40": "High Elf Player's Guide",
    "41": "Lords of Stone and Steel",
    "42": "Temple of Spite",
    "43": "Sylvania The Cursed County",
}

SPELL_TYPES = {
    0: "Other",
    1: "Petty",
    2: "Arcane",
    3: "Lore",
    4: "Elven Arcane",
}

SPELL_LABELS = {
    0: "Beasts",
    1: "Death",
    2: "Fire",
    3: "Heavens",
    4: "Life",
    5: "Light",
    6: "Metal",
    7: "Shadows",
    8: "Daemonology",
    9: "Necromancy",
    10: "Hedgecraft",
    11: "Witchcraft",
    12: "Nurgle",
    13: "Slaanesh",
    14: "Tzeentch",
    15: "High General",
    16: "High Slann",
    17: "Big Waaagh",
    18: "Little Waaagh",
    19: "Plague",
    20: "Ruin",
    21: "Stealth",
    22: "Great Maw",
    23: "Dark Magic",
    1000: "Custom",
    1001: "Ritual",
    1002: "Skaven",
    1003: "Chaos",
    1004: "Fimir Marsh",
    1005: "Magic Of Vaul",
    1006: "High Elf Sea Magic",
    1007: "Magic Of Hoeth",
}


def format_source(source_dict):
    if not source_dict or not isinstance(source_dict, dict):
        return "N/A"
    parts = []
    for k, v in source_dict.items():
        name = SOURCES.get(str(k), f"Source {k}")
        if v:
            v_str = str(v).strip()
            page = v_str if v_str.lower().startswith("p") else f"p. {v_str}"
            parts.append(f"{name} ({page})")
        else:
            parts.append(name)
    return ", ".join(parts) if parts else "N/A"


def format_spell_classification(classification):
    if not classification or not isinstance(classification, dict):
        return "N/A"
    spell_type = SPELL_TYPES.get(classification.get("type"), str(classification.get("type")))
    labels = classification.get("labels") or []
    label_names = [SPELL_LABELS.get(lbl, str(lbl)) for lbl in labels]
    if label_names:
        return f"{spell_type} ({', '.join(label_names)})"
    return spell_type


def get_user_resolver(user_collection):
    user_cache = {}

    def resolve(owner_id_str):
        if not owner_id_str:
            return "N/A"
        if owner_id_str in user_cache:
            return user_cache[owner_id_str]
        user_doc = None
        try:
            user_doc = user_collection.find_one({"_id": ObjectId(owner_id_str)})
        except InvalidId:
            user_doc = user_collection.find_one({"_id": owner_id_str})
        username = user_doc.get("username", "Unknown") if user_doc else "User not found"
        user_cache[owner_id_str] = username
        return username

    return resolve


def find_duplicates(db, collections_to_check, name_filter=None, exact_case=False):
    user_resolver = get_user_resolver(db["user"])
    results_by_collection = {}
    total_public_docs = 0

    for coll_name in collections_to_check:
        coll = db[coll_name]
        # Visibility 2 represents public entries
        public_docs = list(coll.find({"visibility": 2}))
        total_public_docs += len(public_docs)

        # Group by name
        groups = defaultdict(list)
        for doc in public_docs:
            obj = doc.get("object")
            if not isinstance(obj, dict):
                continue
            name = obj.get("name")
            if not name or not isinstance(name, str):
                continue

            cleaned_name = name.strip()
            if not cleaned_name:
                continue

            group_key = cleaned_name if exact_case else cleaned_name.casefold()
            groups[group_key].append(doc)

        # Filter to only groups with duplicates (> 1 document)
        coll_duplicates = []
        for group_key, docs in groups.items():
            if len(docs) <= 1:
                continue

            # If a name filter was specified, check if it matches
            if name_filter:
                match = (
                    name_filter == group_key
                    if exact_case
                    else name_filter.casefold() in group_key
                )
                if not match:
                    continue

            # Distinct original names in this group
            original_names = list(dict.fromkeys(d["object"]["name"] for d in docs))

            # Compare objects to see if content is identical or different
            first_obj = docs[0].get("object", {})
            differing_fields = set()
            for other_doc in docs[1:]:
                other_obj = other_doc.get("object", {})
                all_keys = set(first_obj.keys()) | set(other_obj.keys())
                for k in all_keys:
                    if first_obj.get(k) != other_obj.get(k):
                        differing_fields.add(k)

            coll_duplicates.append(
                {
                    "group_key": group_key,
                    "original_names": original_names,
                    "count": len(docs),
                    "is_identical": len(differing_fields) == 0,
                    "differing_fields": sorted(differing_fields),
                    "docs": docs,
                }
            )

        if coll_duplicates:
            # Sort by duplicate count descending, then name
            coll_duplicates.sort(key=lambda x: (-x["count"], x["group_key"]))
            results_by_collection[coll_name] = coll_duplicates

    return results_by_collection, total_public_docs, user_resolver


def print_report(
    results_by_collection,
    total_public_docs,
    user_resolver,
    db_name,
    mongo_uri,
    collections_checked,
    verbose=False,
):
    total_duplicate_groups = sum(len(dups) for dups in results_by_collection.values())
    total_duplicate_docs = sum(
        sum(item["count"] for item in dups) for dups in results_by_collection.values()
    )

    print("================================================================================")
    print(" DUPLICATE PUBLIC ENTRIES REPORT")
    print("================================================================================")
    print(f"MongoDB URI: {mongo_uri}")
    print(f"Database:    {db_name}")
    print(f"Collections checked ({len(collections_checked)}): {', '.join(collections_checked)}")
    print(f"Total public entries scanned: {total_public_docs}")
    print(f"Total duplicate groups found: {total_duplicate_groups}")
    print(f"Total duplicate entries:      {total_duplicate_docs}")
    print("--------------------------------------------------------------------------------")

    if not results_by_collection:
        print("No duplicate public entries found.")
        print("================================================================================")
        return

    print("SUMMARY BY COLLECTION:")
    for coll_name, dups in results_by_collection.items():
        doc_count = sum(d["count"] for d in dups)
        print(f"  - {coll_name}: {len(dups)} duplicate group(s), {doc_count} total entries")
    print("================================================================================")

    for coll_name, dups in results_by_collection.items():
        print(f"\n>>> COLLECTION: {coll_name.upper()} ({len(dups)} duplicate groups)")
        print("-" * 80)

        for i, group in enumerate(dups, 1):
            names_display = ", ".join(f"'{n}'" for n in group["original_names"])
            content_status = (
                "[IDENTICAL CONTENT]"
                if group["is_identical"]
                else f"[DIFFERENT CONTENT - differing fields: {', '.join(group['differing_fields'])}]"
            )
            print(f"[{i}] Duplicate Name: {names_display} ({group['count']} entries) {content_status}")

            for j, doc in enumerate(group["docs"], 1):
                doc_id = str(doc["_id"])
                owner_id = str(doc.get("ownerid", "N/A"))
                username = user_resolver(owner_id)
                obj = doc.get("object", {})
                source_str = format_source(obj.get("source"))

                print(f"    ({j}) ID:       {doc_id}")
                print(f"        Owner:    {username} (ID: {owner_id})")
                print(f"        Source:   {source_str}")

                if coll_name == "spell":
                    classification_str = format_spell_classification(obj.get("classification"))
                    print(
                        f"        Details:  CN: {obj.get('cn', 'N/A')}, "
                        f"Range: {obj.get('range', 'N/A') or '-'}, "
                        f"Target: {obj.get('target', 'N/A') or '-'}, "
                        f"Duration: {obj.get('duration', 'N/A') or '-'}, "
                        f"Class: {classification_str}"
                    )
                elif coll_name == "property":
                    print(
                        f"        Details:  Type: {obj.get('type', 'N/A')}, "
                        f"Applicable To: {obj.get('applicableto', [])}"
                    )
                elif coll_name == "item":
                    print(
                        f"        Details:  Price: {obj.get('price', 'N/A')}, "
                        f"Enc: {obj.get('enc', 'N/A')}, "
                        f"Availability: {obj.get('availability', 'N/A')}"
                    )
                elif coll_name == "skill":
                    print(
                        f"        Details:  Type: {obj.get('type', 'N/A')}, "
                        f"Attribute: {obj.get('attribute', 'N/A')}"
                    )
                elif coll_name == "prayer":
                    print(
                        f"        Details:  Range: {obj.get('range', 'N/A') or '-'}, "
                        f"Target: {obj.get('target', 'N/A') or '-'}, "
                        f"Duration: {obj.get('duration', 'N/A') or '-'}"
                    )
                elif coll_name == "career":
                    print(
                        f"        Details:  Class: {obj.get('class', 'N/A')}, "
                        f"Species: {obj.get('species', [])}"
                    )
                elif coll_name == "talent":
                    print(
                        f"        Details:  Max Rank: {obj.get('maxrank', 'N/A')}, "
                        f"Tests: {obj.get('tests', 'N/A') or '-'}"
                    )
                elif coll_name == "mutation":
                    print(
                        f"        Details:  Type: {obj.get('type', 'N/A')}"
                    )
                elif coll_name == "rune":
                    print(
                        f"        Details:  Applicable To: {obj.get('applicableto', [])}"
                    )
                elif coll_name == "character":
                    print(
                        f"        Details:  Species: {obj.get('species', 'N/A')}, "
                        f"Career: {obj.get('career', 'N/A')}"
                    )

                desc = obj.get("description", "")
                if desc:
                    desc_clean = " ".join(desc.split())
                    desc_preview = desc_clean[:90] + ("..." if len(desc_clean) > 90 else "")
                    print(f"        Desc:     {desc_preview}")

                if verbose:
                    import json
                    from bson import json_util
                    print("        Full Object:")
                    print("        " + json.dumps(obj, default=json_util.default, indent=2).replace("\n", "\n        "))

            print()


def main():
    parser = argparse.ArgumentParser(
        description="Scan database collections to find duplicate public entries (same name)."
    )
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
        "--collection",
        "-c",
        help="Limit scan to a specific collection (e.g. 'spell', 'property')",
    )
    parser.add_argument(
        "--name",
        "-n",
        help="Filter by specific entry name (case-insensitive substring or exact)",
    )
    parser.add_argument(
        "--exact-case",
        action="store_true",
        help="Group duplicates strictly by exact case-sensitive name",
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Print full object details for each duplicate document",
    )

    args = parser.parse_args()

    client = MongoClient(args.uri)
    db = client[args.db]
    existing_collections = db.list_collection_names()

    if args.collection:
        if args.collection not in existing_collections:
            print(
                f"Error: Collection '{args.collection}' does not exist in database '{args.db}'.",
                file=sys.stderr,
            )
            print(f"Existing collections: {', '.join(existing_collections)}", file=sys.stderr)
            sys.exit(1)
        collections_to_check = [args.collection]
    else:
        collections_to_check = [c for c in CORE_COLLECTIONS if c in existing_collections]

    results, total_public_docs, user_resolver = find_duplicates(
        db,
        collections_to_check,
        name_filter=args.name,
        exact_case=args.exact_case,
    )

    print_report(
        results,
        total_public_docs,
        user_resolver,
        db_name=args.db,
        mongo_uri=args.uri,
        collections_checked=collections_to_check,
        verbose=args.verbose,
    )


if __name__ == "__main__":
    main()
