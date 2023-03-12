import logging

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from .. import mongo, responses as r
from ..request_wrappers import get_request_data
from ..user import service as user_service, schemas as user_schema

user_bp = Blueprint("user", __name__)

LOG = logging.getLogger(__name__)

USER_EXISTS_CODE = 101
USER_EXISTS_HTTP = 400
USER_EXISTS_MSG = "User already exists."

AUTH_FAIL_CODE = 102
AUTH_FAIL_HTTP = 401
AUTH_FAIL_MSG = "Wrong username or password"

NO_USER_CODE = 103
NO_USER_HTTP = 400
NO_USER_MSG = "User not found."

BAD_RESET_TOKEN_CODE = 104
BAD_RESET_TOKEN_HTTP = 401
BAD_RESET_TOKEN_MSG = "Invalid reset password token."

EXPIRED_RESET_TOKEN_CODE = 105
EXPIRED_RESET_TOKEN_HTTP = 401
EXPIRED_RESET_TOKEN_MSG = "Reset password token expired."

RECAPTCHA_CODE = 106
RECAPTCHA_MSG = "Rechaptcha validation failed."
RECAPTCHA_HTTP = 403

PASSWORD_CONFIRM_FAIL_CODE = 107
PASSWORD_CONFIRM_FAIL_HTTP = 403
PASSWORD_CONFIRM_FAIL_MSG = "Incorrect password"


def get_user_id():
    return get_jwt_identity()["id"]


@user_bp.route("/api/user", methods=["POST"])
@get_request_data(schema=user_schema.NEW_USER_SCHEMA)
def register(request_data):
    try:
        user_service.create_user(request_data, request.remote_addr, mongo.db.user)
        return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP)
    except user_service.DuplicateUsernameError:
        return r.api_response(USER_EXISTS_CODE, USER_EXISTS_MSG, USER_EXISTS_HTTP)
    except user_service.RecaptchaError:
        return r.api_response(RECAPTCHA_CODE, RECAPTCHA_MSG, RECAPTCHA_HTTP)


@user_bp.route("/api/user/auth", methods=["POST"])
@get_request_data(schema=user_schema.AUTH_USER_SCHEMA)
def auth(request_data):
    try:
        tokens = user_service.authenticate_user(request_data, mongo.db.user)
        return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP, tokens)
    except (user_service.UsernameNotFoundError, user_service.InvalidPasswordOrUserError):
        return r.api_response(AUTH_FAIL_CODE, AUTH_FAIL_MSG, AUTH_FAIL_HTTP)


@user_bp.route("/api/user", methods=["GET"])
@jwt_required(refresh=False)
def get_user():
    user_id = get_user_id()
    try:
        user = user_service.get_user(user_id, mongo.db.user)
        return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP, user)
    except user_service.UsernameNotFoundError:
        return r.api_response(NO_USER_CODE, NO_USER_MSG, NO_USER_HTTP)


@user_bp.route("/api/user/<username>", methods=["GET"])
@jwt_required(refresh=False)
def get_user_exists(username):
    user_exists = user_service.user_exists(username, mongo.db.user)
    return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP, user_exists)


@user_bp.route("/api/user/refresh", methods=["GET"])
@jwt_required(refresh=True)
def refresh():
    new_access_token = user_service.refresh_access_token()
    return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP, new_access_token)


@user_bp.route("/api/user/update", methods=["POST"])
@jwt_required(refresh=False)
@get_request_data(schema=user_schema.UPDATE_USER_SCHEMA)
def update(request_data):
    user_id = get_user_id()
    try:
        user_service.update_user(user_id, request_data, mongo.db.user)
        return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP)
    except user_service.UsernameNotFoundError:
        return r.api_response(NO_USER_CODE, NO_USER_MSG, NO_USER_HTTP)


@user_bp.route("/api/user/secure_update", methods=["POST"])
@jwt_required(refresh=False)
@get_request_data(schema=user_schema.SECURE_UPDATE_USER_SCHEMA)
def secure_update(request_data):
    user_id = get_user_id()

    try:
        user_service.secure_update_user(user_id, request_data, mongo.db.user)
        return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP)
    except user_service.InvalidPasswordOrUserError:
        return r.api_response(PASSWORD_CONFIRM_FAIL_CODE, PASSWORD_CONFIRM_FAIL_MSG, PASSWORD_CONFIRM_FAIL_HTTP)
    except user_service.UsernameNotFoundError:
        return r.api_response(NO_USER_CODE, NO_USER_MSG, NO_USER_HTTP)
    except user_service.DuplicateUsernameError:
        return r.api_response(USER_EXISTS_CODE, USER_EXISTS_MSG, USER_EXISTS_HTTP)


@user_bp.route("/api/user", methods=["DELETE"])
@jwt_required(refresh=False)
@get_request_data(schema=user_schema.DELETE_USER_SCHEMA)
def delete(request_data):
    user_id = get_user_id()

    try:
        user_service.delete_user(user_id, request_data, mongo.db.user)
        return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP)
    except user_service.InvalidPasswordOrUserError:
        return r.api_response(PASSWORD_CONFIRM_FAIL_CODE, PASSWORD_CONFIRM_FAIL_MSG, PASSWORD_CONFIRM_FAIL_HTTP)
    except user_service.UsernameNotFoundError:
        return r.api_response(NO_USER_CODE, NO_USER_MSG, NO_USER_HTTP)


@user_bp.route("/api/user/send_reset_password", methods=["POST"])
@get_request_data(schema=user_schema.SEND_RESET_PASSWORD_SCHEMA)
def send_reset_password(request_data):
    try:
        domain_name = request.origin
        user_service.send_reset_password(request_data, domain_name, request.remote_addr, mongo.db.user)
    except user_service.RecaptchaError:
        return r.api_response(RECAPTCHA_CODE, RECAPTCHA_MSG, RECAPTCHA_HTTP)
    except (user_service.UsernameNotFoundError, user_service.SendEmailError):
        pass

    return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP)


@user_bp.route("/api/user/reset_password", methods=["POST"])
@get_request_data(schema=user_schema.RESET_PASSWORD_SCHEMA)
def reset_password(request_data):
    try:
        user_service.reset_password(request_data, mongo.db.user)
        return r.api_response(r.SUCCESS_CODE, r.SUCCESS_MSG, r.SUCCESS_HTTP)
    except user_service.ResetTokenExpiredError:
        return r.api_response(EXPIRED_RESET_TOKEN_CODE, EXPIRED_RESET_TOKEN_MSG, EXPIRED_RESET_TOKEN_HTTP)
    except user_service.InvalidResetTokenError:
        return r.api_response(BAD_RESET_TOKEN_CODE, BAD_RESET_TOKEN_MSG, BAD_RESET_TOKEN_HTTP)
    except user_service.UsernameNotFoundError:
        return r.api_response(NO_USER_CODE, NO_USER_MSG, NO_USER_HTTP)
