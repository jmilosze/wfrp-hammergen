from functools import wraps

from flask import request
from flask_jwt_extended import get_jwt_identity, get_jwt
from werkzeug.exceptions import BadRequest
from schema import SchemaError

from . import responses as r
from .user.claims import UserClaims


def get_request_data(schema):
    def inner_decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                input_data = request.get_json()
                schema.validate(input_data)
                return fn(request_data=input_data, *args, **kwargs)
            except BadRequest:
                return r.api_response(r.BAD_REQUEST_CODE, r.BAD_REQUEST_MSG, r.BAD_PARAMS_HTTP)
            except SchemaError as exp:
                return r.api_response(r.BAD_PARAMS_CODE, f"{r.BAD_PARAMS_MSG} {exp}", r.BAD_PARAMS_HTTP)

        return wrapper

    return inner_decorator


def get_user(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token_identity = get_jwt_identity()
        if token_identity:
            user_id = token_identity["id"]
            shared_acc = token_identity["shared_accounts"]
            claims = get_jwt().get("uc") or []
        else:
            user_id = "anonymous"
            shared_acc = []
            claims = []

        is_master_admin = True if UserClaims.MASTER_ADMIN.value in claims else False
        user = {"id": user_id, "master_admin": is_master_admin, "shared_acc": shared_acc}

        return fn(user=user, *args, **kwargs)

    return wrapper
