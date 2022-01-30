from copy import deepcopy

from bson import ObjectId

CHARACTER_FIELDS = [
    "owner_id",
    "name",
    "description",
    "notes",
    "equipped_items",
    "carried_items",
    "stored_items",
    "skills",
    "talents",
    "species",
    "base_attributes",
    "attribute_advances",
    "career_path",
    "career",
    "fate",
    "fortune",
    "resilience",
    "resolve",
    "current_exp",
    "spent_exp",
    "status",
    "standing",
    "brass",
    "silver",
    "gold",
    "spells",
    "sin",
    "corruption",
    "mutations",
]

list_fields = [
    "equipped_items",
    "carried_items",
    "stored_items",
    "skills",
    "talents",
    "career_path",
    "spells",
    "mutations",
]


def unwind(field_name):
    return {"$unwind": {"path": f"${field_name}", "preserveNullAndEmptyArrays": True}}


def to_object_id(field_name, field_is_object=True):
    field_to_add = f"{field_name}.id" if field_is_object else f"{field_name}"
    return {"$addFields": {field_to_add: {"$toObjectId": f"${field_to_add}"}}}


def lookup(collection, join_name, field_name, field_is_object=True):
    local_field = f"{field_name}.id" if field_is_object else f"{field_name}"

    return {
        "$lookup": {
            "from": f"{collection}",
            "localField": local_field,
            "foreignField": "_id",
            "as": f"{join_name}",
        }
    }


def group(field_name, join_name, nested_name=None):
    fields = {field: {"$first": f"${field}"} for field in CHARACTER_FIELDS}
    fields.update({"_id": "$_id"})
    if nested_name:
        fields[field_name] = {
            "$push": {f"{nested_name}": f"${field_name}.{nested_name}", "value": {"$arrayElemAt": [f"${join_name}", 0]}}
        }
    else:
        fields[field_name] = {"$push": {"value": {"$arrayElemAt": [f"${join_name}", 0]}}}
    return {"$group": fields}


def resolve(field_name, collection, nested_name=None):
    if nested_name:
        return [
            unwind(field_name),
            to_object_id(field_name),
            lookup(collection, "resolved", field_name),
            group(field_name, "resolved", nested_name),
        ]
    else:
        return [
            unwind(field_name),
            to_object_id(field_name, False),
            lookup(collection, "resolved", field_name, False),
            group(field_name, "resolved"),
        ]


def query_character(character_id, owners_query, char_collection, item_prop_collection):
    match = {
        "$match": {"$and": [{"_id": ObjectId(character_id)}, owners_query]}
    }

    character = char_collection.aggregate(
        [
            match,
            *resolve("talents", "talent", "number"),
            *resolve("skills", "skill", "number"),
            *resolve("equipped_items", "item", "number"),
            *resolve("carried_items", "item", "number"),
            *resolve("stored_items", "item", "number"),
            *resolve("career_path", "career", "level"),
            *resolve("spells", "spell"),
            *resolve("mutations", "mutation"),
            to_object_id("career"),
            lookup("career", "career.value", "career"),
        ]
    )

    try:
        character = next(character)
    except StopIteration:
        return []

    del character["career"]["id"]
    character["career"]["value"] = character["career"]["value"][0]
    character["career"]["id"] = str(character["career"]["value"]["_id"])
    del character["career"]["value"]["_id"]

    for field in list_fields:
        if not character[field][0]:
            character[field] = []
        else:
            del_index = []
            for idx, item in enumerate(character[field]):
                if item.get("value"):
                    item["id"] = str(item["value"]["_id"])
                    del item["value"]["_id"]
                else:
                    del_index.append(idx)
            for idx in sorted(del_index, reverse=True):
                del character[field][idx]

    distinct_item_properties = set()
    for item_location in ["equipped_items", "carried_items", "stored_items"]:
        for item in character[item_location]:
            for prop in item["value"]["properties"]:
                distinct_item_properties.add(prop)

    if distinct_item_properties:
        query = {"$or": [{"_id": ObjectId(prop)} for prop in distinct_item_properties]}
        properties = {}
        for prop in item_prop_collection.find(query):
            prop["id"] = str(prop["_id"])
            del prop["_id"]
            properties[prop["id"]] = prop

        for item_location in ["equipped_items", "carried_items", "stored_items"]:
            for item in character[item_location]:
                item_props = []
                for prop in item["value"]["properties"]:
                    try:
                        item_props.append(deepcopy(properties[prop]))
                    except KeyError:
                        pass
                item["value"]["properties"] = item_props

    return character
