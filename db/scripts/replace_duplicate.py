#!/usr/bin/env python3
import argparse
import copy
import os
import sys
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


def find_entry_by_id(db, id_str):
    try:
        oid = ObjectId(id_str)
    except InvalidId:
        return None, None

    for coll_name in CORE_COLLECTIONS:
        coll = db[coll_name]
        doc = coll.find_one({"_id": oid})
        if doc is not None:
            return coll_name, doc

    return None, None


def replace_in_object(data, id1, id2):
    """
    Recursively replaces all occurrences of id1 with id2 in a BSON document structure.
    Handles:
      - Raw strings equal to id1
      - Lists of strings (with deduplication)
      - Lists of dicts with 'id' key (merges duplicates taking max 'number' when present)
      - Dict keys equal to id1
      - Nested dict values
    """
    if isinstance(data, str):
        if data == id1:
            return id2, True
        return data, False

    elif isinstance(data, list):
        has_replacement = False
        new_list = []
        for item in data:
            new_item, item_changed = replace_in_object(item, id1, id2)
            if item_changed:
                has_replacement = True
            new_list.append(new_item)

        if not has_replacement:
            return data, False

        # If it is a list of strings, deduplicate
        if all(isinstance(x, str) for x in new_list):
            seen = set()
            deduped = []
            for x in new_list:
                if x not in seen:
                    seen.add(x)
                    deduped.append(x)
            return deduped, True

        return new_list, True

    elif isinstance(data, dict):
        has_replacement = False
        new_dict = {}
        for k, v in data.items():
            new_k = id2 if k == id1 else k
            if new_k != k:
                has_replacement = True
            new_v, v_changed = replace_in_object(v, id1, id2)
            if v_changed:
                has_replacement = True
            new_dict[new_k] = new_v

        if not has_replacement:
            return data, False

        return new_dict, True

    else:
        return data, False


def scan_for_replacements(db, id1, id2):
    """
    Scans all database collections for any reference to id1 and returns a list
    of replacement operations to be performed.
    """
    affected_documents = []
    existing_collections = db.list_collection_names()

    for coll_name in existing_collections:
        if coll_name in ("user", "system.indexes", "system.profile"):
            continue

        coll = db[coll_name]
        for doc in coll.find():
            # Skip the document being deleted
            if str(doc["_id"]) == id1:
                continue

            doc_copy = copy.deepcopy(doc)
            updated_doc, changed = replace_in_object(doc_copy, id1, id2)

            if changed:
                # Determine which fields were modified
                modified_fields = []
                orig_obj = doc.get("object")
                upd_obj = updated_doc.get("object")
                if isinstance(orig_obj, dict) and isinstance(upd_obj, dict):
                    for k in orig_obj:
                        if orig_obj[k] != upd_obj.get(k):
                            modified_fields.append(f"object.{k}")
                    for k in upd_obj:
                        if k not in orig_obj:
                            modified_fields.append(f"object.{k}")
                else:
                    for k in doc:
                        if k != "_id" and doc[k] != updated_doc.get(k):
                            modified_fields.append(k)

                doc_name = (
                    doc.get("object", {}).get("name")
                    if isinstance(doc.get("object"), dict)
                    else doc.get("name", "N/A")
                )

                affected_documents.append(
                    {
                        "collection": coll_name,
                        "id": str(doc["_id"]),
                        "name": doc_name or "N/A",
                        "ownerid": str(doc.get("ownerid", "N/A")),
                        "modified_fields": modified_fields,
                        "updated_doc": updated_doc,
                    }
                )

    return affected_documents


def main():
    parser = argparse.ArgumentParser(
        description="Replace all references to a duplicate public entry (id1) with another (id2), and delete id1."
    )
    parser.add_argument(
        "id1",
        help="ID of the duplicate entry to be replaced and deleted",
    )
    parser.add_argument(
        "id2",
        help="ID of the public entry to replace it with",
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

    args = parser.parse_args()
    id1 = args.id1.strip()
    id2 = args.id2.strip()

    if id1 == id2:
        print("Error: id1 and id2 cannot be the same ID.", file=sys.stderr)
        sys.exit(1)

    client = MongoClient(args.uri)
    db = client[args.db]
    user_resolver = get_user_resolver(db["user"])

    # 1. Look up id1 and id2
    coll1, doc1 = find_entry_by_id(db, id1)
    if not doc1:
        print(f"Error: id1 '{id1}' not found in any core collection.", file=sys.stderr)
        sys.exit(1)

    coll2, doc2 = find_entry_by_id(db, id2)
    if not doc2:
        print(f"Error: id2 '{id2}' not found in any core collection.", file=sys.stderr)
        sys.exit(1)

    # 2. Verify collection type matches
    if coll1 != coll2:
        print(
            f"Error: Type mismatch. id1 belongs to collection '{coll1}', but id2 belongs to '{coll2}'.",
            file=sys.stderr,
        )
        sys.exit(1)

    # 3. Verify both entries are public (visibility == 2)
    vis1 = doc1.get("visibility")
    vis2 = doc2.get("visibility")
    if vis1 != 2 or vis2 != 2:
        print(
            f"Error: Both entries must be public (visibility == 2). "
            f"id1 visibility is {vis1}, id2 visibility is {vis2}.",
            file=sys.stderr,
        )
        sys.exit(1)

    # 4. Verify both entries have exactly the same name
    name1 = doc1.get("object", {}).get("name") if isinstance(doc1.get("object"), dict) else None
    name2 = doc2.get("object", {}).get("name") if isinstance(doc2.get("object"), dict) else None

    if not name1 or not name2 or name1 != name2:
        print(
            f"Error: Entries do not have exactly the same name. "
            f"id1 name: '{name1}', id2 name: '{name2}'.",
            file=sys.stderr,
        )
        sys.exit(1)

    # 5. Display details of id1 and id2
    owner1_username = user_resolver(str(doc1.get("ownerid", "")))
    owner2_username = user_resolver(str(doc2.get("ownerid", "")))
    source1_str = format_source(doc1.get("object", {}).get("source"))
    source2_str = format_source(doc2.get("object", {}).get("source"))

    print("================================================================================")
    print(" DUPLICATE ENTRY REPLACEMENT PLAN")
    print("================================================================================")
    print(f"Collection:     {coll1}")
    print(f"Entry Name:     '{name1}'")
    print("--------------------------------------------------------------------------------")
    print(f"ENTRY TO BE REPLACED AND DELETED (id1):")
    print(f"  ID:     {id1}")
    print(f"  Owner:  {owner1_username} ({doc1.get('ownerid')})")
    print(f"  Source: {source1_str}")
    print("--------------------------------------------------------------------------------")
    print(f"TARGET ENTRY TO KEEP (id2):")
    print(f"  ID:     {id2}")
    print(f"  Owner:  {owner2_username} ({doc2.get('ownerid')})")
    print(f"  Source: {source2_str}")
    print("================================================================================")

    # 6. Scan database for references to id1
    print("\nScanning database collections for references to id1...")
    affected = scan_for_replacements(db, id1, id2)

    if affected:
        print(f"\nFound {len(affected)} document(s) referencing id1:")
        for item in affected:
            owner_user = user_resolver(item["ownerid"])
            fields_str = ", ".join(item["modified_fields"])
            print(
                f"  - [{item['collection']}] '{item['name']}' (ID: {item['id']}, Owner: {owner_user})\n"
                f"      Fields updated: {fields_str}"
            )
    else:
        print("\nNo references to id1 were found in any other documents.")

    print(f"\nDocument {id1} ('{name1}') in collection '{coll1}' will be PERMANENTLY DELETED.")
    print("================================================================================")

    # 7. Ask for confirmation
    action_desc = (
        f"replace references in {len(affected)} document(s) and delete entry '{id1}'"
        if affected
        else f"delete duplicate entry '{id1}'"
    )
    try:
        confirmation = (
            input(f"Are you sure you want to {action_desc}? (type 'yes' to confirm): ")
            .strip()
            .lower()
        )
    except (KeyboardInterrupt, EOFError):
        print("\nAborted by user. No changes were made.")
        sys.exit(0)

    if confirmation != "yes":
        print("Confirmation was not 'yes'. Aborted without making any changes.")
        sys.exit(0)

    # 8. Execute updates
    print("\nApplying changes...")
    for item in affected:
        coll = db[item["collection"]]
        coll.replace_one({"_id": ObjectId(item["id"])}, item["updated_doc"])
        print(f"  - Updated [{item['collection']}] ID: {item['id']}")

    # 9. Delete id1
    del_res = db[coll1].delete_one({"_id": ObjectId(id1)})
    if del_res.deleted_count == 1:
        print(f"  - Deleted duplicate [{coll1}] ID: {id1}")
    else:
        print(f"  - Warning: Failed to delete [{coll1}] ID: {id1}", file=sys.stderr)

    print("\nReplacement and deletion completed successfully!")


if __name__ == "__main__":
    main()
