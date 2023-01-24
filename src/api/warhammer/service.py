from copy import deepcopy

from bson import ObjectId

from ..warhammer.character import query_character


class ElementNotFoundError(Exception):
    pass


def set_edit_permissions(element, user_id, is_master_admin, shared_acc):
    if element["owner_id"] != user_id and element["owner_id"] in shared_acc:
        element["can_edit"] = False
    else:
        if is_master_admin:
            element["can_edit"] = True
        else:
            element["can_edit"] = True if element["owner_id"] == user_id else False

    element["id"] = str(element["_id"])

    return {key: element[key] for key in element if key not in ["_id", "owner_id"]}


def all_allowed_owners_query(user_id, shared_acc):
    if shared_acc:
        return {
            "$or": [
                {"owner_id": user_id},
                {"owner_id": "admin"},
                {"$and": [{"shared": True}, {"$or": [{"owner_id": user_id} for user_id in shared_acc]}]},
            ]
        }
    else:
        return {"$or": [{"owner_id": user_id}, {"owner_id": "admin"}]}


def create_element(user_id, element, is_master_admin, element_collection):
    element_with_owner = deepcopy(element)
    if is_master_admin:
        element_with_owner["owner_id"] = "admin"
    else:
        element_with_owner["owner_id"] = user_id
    insert_result = element_collection.insert_one(element_with_owner)

    return {"id": str(insert_result.inserted_id)}


def get_element(user_id, element_id, is_master_admin, shared_acc, element_collection):
    element = element_collection.find_one(
        {"$and": [{"_id": ObjectId(element_id)}, all_allowed_owners_query(user_id, shared_acc)]}
    )

    if not element:
        raise ElementNotFoundError

    return set_edit_permissions(element, user_id, is_master_admin, shared_acc)


def update_element(user_id, update_data, is_master_admin, element_collection):
    elem_id = ObjectId(update_data["id"])
    new_elem_data = deepcopy(update_data)
    del new_elem_data["id"]

    if new_elem_data:
        if is_master_admin:
            result = element_collection.update_one(
                {"$and": [{"_id": elem_id}, {"owner_id": "admin"}]}, {"$set": new_elem_data}
            )
        else:
            result = element_collection.update_one(
                {"$and": [{"_id": elem_id}, {"owner_id": user_id}]}, {"$set": new_elem_data}
            )

        if result.matched_count == 0:
            raise ElementNotFoundError

    return {"id": update_data["id"]}


def delete_element(user_id, element_id, is_master_admin, element_collection):
    if is_master_admin:
        result = element_collection.delete_one({"$and": [{"_id": ObjectId(element_id)}, {"owner_id": "admin"}]})
    else:
        result = element_collection.delete_one({"$and": [{"_id": ObjectId(element_id)}, {"owner_id": user_id}]})

    if result.deleted_count == 0:
        raise ElementNotFoundError


def list_elements(user_id, is_master_admin, shared_acc, element_collection):
    elements = element_collection.find(all_allowed_owners_query(user_id, shared_acc))

    list_of_elements = []
    for element in elements:
        list_of_elements.append(set_edit_permissions(element, user_id, is_master_admin, shared_acc))

    return list_of_elements


def get_character_resolved(character_id, user_id, is_master_admin, shared_acc, character_coll, item_prop_coll, spell_coll):
    owners_query = all_allowed_owners_query(user_id, shared_acc)
    character = query_character(character_id, owners_query, character_coll, item_prop_coll, spell_coll)

    if not character:
        raise ElementNotFoundError

    return set_edit_permissions(character, user_id, is_master_admin, shared_acc)


def get_generation_props(collection):
    generation_props = collection.find_one({"name": "generation_props"})

    if not generation_props:
        raise ElementNotFoundError

    return {key: generation_props[key] for key in generation_props if key not in ["_id", "name"]}
