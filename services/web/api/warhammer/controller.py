from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from werkzeug.exceptions import BadRequest
from schema import SchemaError

from .. import mongo, responses as r
from ..request_wrappers import get_user
from ..warhammer.schamas import NEW_ELEM_SCHEMAS, UPDATE_ELEM_SCHEMAS, ID_SCHEMA
from ..warhammer import service as wh_service, responses as elem_r


wh_bp = Blueprint("warhammer", __name__)

COLLECTIONS = {
    "item_property": mongo.db.property,
    "item": mongo.db.item,
    "skill": mongo.db.skill,
    "talent": mongo.db.talent,
    "career": mongo.db.career,
    "character": mongo.db.character,
    "other": mongo.db.other,
    "spell": mongo.db.spell,
    "mutation": mongo.db.mutation,
}


def validate_element_type(element_type):
    if element_type in COLLECTIONS.keys():
        return element_type
    else:
        return None


@wh_bp.route("/api/<element_type>/<element_id>", methods=["DELETE"])
@jwt_required(optional=False)
@get_user
def delete_element(element_type, element_id, user):
    if element := validate_element_type(element_type):
        try:
            ID_SCHEMA.validate(element_id)
        except SchemaError as exp:
            return r.api_response(r.BAD_PARAMS_CODE, f"{r.BAD_PARAMS_MSG} {exp}", r.BAD_PARAMS_HTTP)

        try:
            wh_service.delete_element(user["id"], element_id, user["master_admin"], COLLECTIONS[element])
            return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP)
        except wh_service.ElementNotFoundError:
            return r.api_response(elem_r.NO_ELEMENT_CODE, elem_r.NO_ELEMENT_MSG, elem_r.NO_ELEMENT_HTTP)
    else:
        return r.api_response(elem_r.BAD_ELEMENT_TYPE_CODE, elem_r.BAD_ELEMENT_TYPE_MSG, elem_r.BAD_ELEMENT_TYPE_HTTP)


@wh_bp.route("/api/<element_type>/<element_id>", methods=["GET"])
@jwt_required(optional=True)
@get_user
def get_element(element_type, element_id, user):
    if element := validate_element_type(element_type):
        try:
            ID_SCHEMA.validate(element_id)
        except SchemaError as exp:
            return r.api_response(r.BAD_PARAMS_CODE, f"{r.BAD_PARAMS_MSG} {exp}", r.BAD_PARAMS_HTTP)

        try:
            element = wh_service.get_element(
                user["id"], element_id, user["master_admin"], user["shared_acc"], COLLECTIONS[element]
            )
            return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP, element)
        except wh_service.ElementNotFoundError:
            return r.api_response(elem_r.NO_ELEMENT_CODE, elem_r.NO_ELEMENT_MSG, elem_r.NO_ELEMENT_HTTP)
    else:
        return r.api_response(elem_r.BAD_ELEMENT_TYPE_CODE, elem_r.BAD_ELEMENT_TYPE_MSG, elem_r.BAD_ELEMENT_TYPE_HTTP)


@wh_bp.route("/api/<element_type>", methods=["GET"])
@jwt_required(optional=True)
@get_user
def get_list_of_elements(element_type, user):
    if element := validate_element_type(element_type):
        list_of_elements = wh_service.list_elements(
            user["id"], user["master_admin"], user["shared_acc"], COLLECTIONS[element]
        )
        return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP, list_of_elements)
    else:
        return r.api_response(elem_r.BAD_ELEMENT_TYPE_CODE, elem_r.BAD_ELEMENT_TYPE_MSG, elem_r.BAD_ELEMENT_TYPE_HTTP)


@wh_bp.route("/api/<element_type>", methods=["POST"])
@jwt_required(optional=False)
@get_user
def create_element(element_type, user):
    if element := validate_element_type(element_type):

        try:
            schema = NEW_ELEM_SCHEMAS[element]
            request_data = schema.validate(request.get_json())
        except BadRequest:
            return r.api_response(r.BAD_REQUEST_CODE, r.BAD_REQUEST_MSG, r.BAD_PARAMS_HTTP)
        except SchemaError as exp:
            return r.api_response(r.BAD_PARAMS_CODE, f"{r.BAD_PARAMS_MSG} {exp}", r.BAD_PARAMS_HTTP)

        inserted_id = wh_service.create_element(user["id"], request_data, user["master_admin"], COLLECTIONS[element])
        return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP, inserted_id)
    else:
        return r.api_response(elem_r.BAD_ELEMENT_TYPE_CODE, elem_r.BAD_ELEMENT_TYPE_MSG, elem_r.BAD_ELEMENT_TYPE_HTTP)


@wh_bp.route("/api/<element_type>/update", methods=["POST"])
@jwt_required(optional=False)
@get_user
def update_element(element_type, user):
    if element := validate_element_type(element_type):

        try:
            schema = UPDATE_ELEM_SCHEMAS[element]
            request_data = schema.validate(request.get_json())
        except BadRequest:
            return r.api_response(r.BAD_REQUEST_CODE, r.BAD_REQUEST_MSG, r.BAD_PARAMS_HTTP)
        except SchemaError as exp:
            return r.api_response(r.BAD_PARAMS_CODE, f"{r.BAD_PARAMS_MSG} {exp}", r.BAD_PARAMS_HTTP)

        try:
            updated_id = wh_service.update_element(user["id"], request_data, user["master_admin"], COLLECTIONS[element])
            return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP, updated_id)
        except wh_service.ElementNotFoundError:
            return r.api_response(elem_r.NO_ELEMENT_CODE, elem_r.NO_ELEMENT_MSG, elem_r.NO_ELEMENT_HTTP)
    else:
        return r.api_response(elem_r.BAD_ELEMENT_TYPE_CODE, elem_r.BAD_ELEMENT_TYPE_MSG, elem_r.BAD_ELEMENT_TYPE_HTTP)


@wh_bp.route("/api/character_resolved/<character_id>", methods=["GET"])
@jwt_required(optional=True)
@get_user
def get_character_resolved(character_id, user):
    try:
        ID_SCHEMA.validate(character_id)
    except SchemaError as exp:
        return r.api_response(r.BAD_PARAMS_CODE, f"{r.BAD_PARAMS_MSG} {exp}", r.BAD_PARAMS_HTTP)

    try:
        character = wh_service.get_character_resolved(
            character_id,
            user["id"],
            user["master_admin"],
            user["shared_acc"],
            COLLECTIONS["character"],
            COLLECTIONS["item_property"],
        )
        return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP, character)
    except wh_service.ElementNotFoundError:
        return r.api_response(elem_r.NO_ELEMENT_CODE, elem_r.NO_ELEMENT_MSG, elem_r.NO_ELEMENT_HTTP)


@wh_bp.route("/api/generation_props", methods=["GET"])
def get_generation_props():
    try:
        generation_props = wh_service.get_generation_props(COLLECTIONS["other"])
        return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP, generation_props)
    except wh_service.ElementNotFoundError:
        return r.api_response(elem_r.NO_ELEMENT_CODE, elem_r.NO_ELEMENT_MSG, elem_r.NO_ELEMENT_HTTP)
