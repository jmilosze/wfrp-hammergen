import datetime
import json
import logging
import os
import urllib.parse
from copy import deepcopy
from datetime import timedelta

import requests
from bson import ObjectId
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token, get_jwt_identity, get_jwt
from jwt.exceptions import ExpiredSignatureError
from pymongo.errors import DuplicateKeyError

from ..user.claims import UserClaims

MAILJET_API_KEY = os.environ["MAILJET_API_KEY"]
MAILJET_API_SECRET = os.environ["MAILJET_API_SECRET"]
RECAPTCHA_SECRET = os.environ["RECAPTCHA_SECRET"]
FRONTEND_URL = os.getenv("FRONTEND_URL", "")

RESET_TOKEN_EXPIRY_HOURS = 2
RESET_PASSWORD_PAGE = "/resetPassword/{reset_token}"
RESET_PASSWORD_FROM_EMAIL = "admin@hammergen.net"
RESET_PASSWORD_SUBJECT = "Reset password"
RESET_PASSWORD_CONTENT = "Please reset your password by <a href={url}>clicking here</a>"
MAILJET_API_URL = "https://api.mailjet.com/v3.1/send"
MAILJET_API_TIMEOUT_SECONDS = 60

LOG = logging.getLogger(__name__)


class InvalidUserDataError(Exception):
    pass


class DuplicateUsernameError(Exception):
    pass


class UsernameNotFoundError(Exception):
    pass


class InvalidPasswordOrUserError(Exception):
    pass


class InvalidResetTokenError(Exception):
    pass


class ResetTokenExpiredError(Exception):
    pass


class SendEmailError(Exception):
    pass


class RecaptchaError(Exception):
    pass


def create_user(user_data, request_ip, user_collection):
    if not validate_recaptcha(user_data["recaptcha"], request_ip):
        raise RecaptchaError
    db_user = {}
    for update_key, update_value in user_data.items():
        if update_key != "password" and update_key != "recaptcha":
            db_user[update_key] = deepcopy(update_value)

    db_user["password_hash"] = generate_password_hash(user_data["password"])
    db_user["claims"] = [UserClaims.USER.value]
    db_user["created_on"] = datetime.datetime.utcnow()

    try:
        user_collection.insert_one(db_user)
    except DuplicateKeyError:
        raise DuplicateUsernameError


def get_user(user_id, user_collection):
    return_fields = ["username", "name"]

    user = user_collection.aggregate(
        [
            {"$match": {"_id": ObjectId(user_id)}},
            {"$unwind": {"path": "$shared_accounts", "preserveNullAndEmptyArrays": True}},
            {"$addFields": {"shared_accounts": {"$toObjectId": "$shared_accounts"}}},
            {
                "$lookup": {
                    "from": "user",
                    "localField": "shared_accounts",
                    "foreignField": "_id",
                    "as": "shared_acc",
                }
            },
            {
                "$group": {
                    "_id": "$_id",
                    "shared_accounts": {"$push": {"$arrayElemAt": ["$shared_acc.username", 0]}},
                    **{field: {"$first": f"${field}"} for field in return_fields},
                }
            },
        ]
    )

    try:
        user = next(user)
        del user["_id"]
    except StopIteration:
        raise UsernameNotFoundError

    return user


def delete_user(user_id, user_data, user_collection):
    _validate_user_password(user_id, user_data["password"], user_collection)

    result = user_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise UsernameNotFoundError


def _validate_user_password(user_id, password, user_collection):
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise UsernameNotFoundError

    if not check_password_hash(user["password_hash"], password):
        raise InvalidPasswordOrUserError


def authenticate_user(user_data, user_collection):
    username = user_data["username"]
    db_user = user_collection.find_one({"username": username})
    if not db_user:
        raise UsernameNotFoundError

    if not check_password_hash(db_user["password_hash"], user_data["password"]):
        raise InvalidPasswordOrUserError

    try:
        db_update = {"last_auth_on": datetime.datetime.utcnow()}
        user_collection.update_one({"_id": db_user["_id"]}, {"$set": db_update})
    except DuplicateKeyError:
        raise UsernameNotFoundError

    user = {"id": str(db_user["_id"]), "shared_accounts": db_user.get("shared_accounts")}
    access_token = create_access_token(identity=user, additional_claims={"uc": db_user["claims"]})
    refresh_token = create_refresh_token(identity=user, additional_claims={"uc": db_user["claims"]})

    return {"access_token": access_token, "refresh_token": refresh_token}


def refresh_access_token():
    user = get_jwt_identity()
    claims = get_jwt().get("uc") or []
    access_token = create_access_token(identity=user, additional_claims={"uc": claims})
    return {"access_token": access_token}


def update_user(user_id, update_data, user_collection):
    if "shared_accounts" in update_data:
        update_data["shared_accounts"] = username_to_id(user_id, update_data["shared_accounts"], user_collection)

    if update_data:
        result = user_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        if result.matched_count == 0:
            raise UsernameNotFoundError


def secure_update_user(user_id, update_data, user_collection):
    _validate_user_password(user_id, update_data["current_password"], user_collection)

    if "shared_accounts" in update_data:
        update_data["shared_accounts"] = username_to_id(user_id, update_data["shared_accounts"], user_collection)

    db_user = {}
    for update_key, update_value in update_data.items():
        if update_key == "password":
            db_user["password_hash"] = generate_password_hash(update_value)
        elif update_key != "current_password":
            db_user[update_key] = deepcopy(update_value)

    if not db_user:
        return

    try:
        result = user_collection.update_one({"_id": ObjectId(user_id)}, {"$set": db_user})
    except DuplicateKeyError:
        raise DuplicateUsernameError

    if result.matched_count == 0:
        raise UsernameNotFoundError


def send_reset_password(send_reset_data, domain_name, request_ip, user_collection):
    if not validate_recaptcha(send_reset_data["recaptcha"], request_ip):
        raise RecaptchaError
    user = user_collection.find_one({"username": send_reset_data["username"]})
    if not user:
        raise UsernameNotFoundError

    reset_token = create_access_token(
        identity=str(user["_id"]),
        additional_claims={"uc": UserClaims.PASSWORD_RESET.value},
        expires_delta=timedelta(hours=RESET_TOKEN_EXPIRY_HOURS),
    )
    _send_reset_password_email(send_reset_data["username"], reset_token, domain_name)


def _send_reset_password_email(email, reset_token, domain_name):
    url = urllib.parse.urljoin(domain_name, RESET_PASSWORD_PAGE.format(reset_token=reset_token))

    data = {
        'Messages': [
            {
                "From": {
                    "Email": RESET_PASSWORD_FROM_EMAIL,
                    "Name": "Hammergen admin"
                },
                "To": [{"Email": email}],
                "Subject": RESET_PASSWORD_SUBJECT,
                "HTMLPart": RESET_PASSWORD_CONTENT.format(url=url)
            }
        ]
    }

    headers = {"Content-type": "application/json"}
    try:
        result = requests.post(MAILJET_API_URL, data=json.dumps(data), headers=headers,
                               auth=(MAILJET_API_KEY, MAILJET_API_SECRET),
                               timeout=MAILJET_API_TIMEOUT_SECONDS, verify=True, stream=False)
    except Exception as exp:
        LOG.exception(str(exp))
        raise SendEmailError

    if result.status_code != requests.codes.ok:
        LOG.exception("Invalid response from Mailjet server, response code %s, response body %s", result.status_code,
                      result.json())
        raise SendEmailError


def reset_password(reset_data, user_collection):
    try:
        decoded_token = decode_token(reset_data["reset_token"])
        user_id = decoded_token["sub"]
        if UserClaims.PASSWORD_RESET.value not in decoded_token["uc"]:
            raise Exception("Invalid username or user claims.")
    except ExpiredSignatureError:
        raise ResetTokenExpiredError
    except Exception as exp:
        LOG.exception(str(exp))
        raise InvalidResetTokenError

    password_hash = generate_password_hash(reset_data["password"])

    result = user_collection.update_one({"_id": ObjectId(user_id)}, {"$set": {"password_hash": password_hash}})
    if result.matched_count == 0:
        raise UsernameNotFoundError


def validate_recaptcha(token, request_ip):
    try:
        resp = requests.post(
            "https://www.google.com/recaptcha/api/siteverify",
            params={"secret": RECAPTCHA_SECRET, "response": token, "remoteip": request_ip},
            timeout=10,
        )
        validation_result = json.loads(resp.content)
    except Exception as exp:
        LOG.exception(str(exp))
        validation_result = {"score": 1.0}

    LOG.info(validation_result)
    return validation_result["score"] >= 0.5


def username_to_id(user_id, username_list, user_collection):
    if username_list:
        users = user_collection.find({"$or": [{"username": x} for x in username_list]}, projection=[])
        return [str(x["_id"]) for x in users if str(x) != user_id]
    else:
        return []


def user_exists(username, user_collection):
    element = user_collection.find_one({"username": username})
    return {"exists": True if element else False}


if __name__ == "__main__":
    _send_reset_password_email("jacek.miloszewski@gmail.com", "zxc", "asd")
