from enum import Enum


class UserClaims(Enum):
    USER = "user"
    PASSWORD_RESET = "password_reset"
    MASTER_ADMIN = "master_admin"
