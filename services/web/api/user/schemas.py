from schema import Schema, And, Optional

NAME_SCHEMA = Schema(And(str, lambda name: 1 <= len(name) <= 20))
USERNAME_SCHEMA = Schema(And(str, len))
PASSWORD_SCHEMA = Schema(And(str, lambda password: 5 <= len(password)))

USER_ELEMENTS = {"name": NAME_SCHEMA, "username": USERNAME_SCHEMA, "shared_accounts": [USERNAME_SCHEMA]}

AUTH_USER_SCHEMA = Schema({"username": str, "password": str})
UPDATE_USER_SCHEMA = Schema({Optional(key): USER_ELEMENTS[key] for key in USER_ELEMENTS if key != "username"})
RESET_PASSWORD_SCHEMA = Schema({"password": PASSWORD_SCHEMA, "reset_token": str})
DELETE_USER_SCHEMA = Schema({"password": str})
SEND_RESET_PASSWORD_SCHEMA = Schema({"username": str, "recaptcha": str})
NEW_USER_SCHEMA = Schema({"password": PASSWORD_SCHEMA, "recaptcha": str, **USER_ELEMENTS})
SECURE_UPDATE_USER_SCHEMA = Schema(
    {
        Optional("password"): PASSWORD_SCHEMA,
        "current_password": str,
        **{Optional(key): USER_ELEMENTS[key] for key in USER_ELEMENTS},
    }
)
