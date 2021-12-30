from flask import jsonify


def api_response(code, msg, http, data=None):
    return jsonify({"code": code, "msg": msg, "data": data}), http


SUCCESS_CODE = 0
SUCCESS_HTTP = 200
SUCCESS_MSG = "Ok."

BAD_REQUEST_CODE = 1
BAD_REQUEST_HTTP = 400
BAD_REQUEST_MSG = "Bad request."

BAD_PARAMS_CODE = 2
BAD_PARAMS_HTTP = 400
BAD_PARAMS_MSG = "Bad request parameters."

NO_JWT_CODE = 3
NO_JWT_HTTP = 401
NO_JWT_MSG = "No JWT token in the header."

INVALID_JWT_CODE = 4
INVALID_JWT_HTTP = 401
INVALID_JWT_MSG = "Invalid JWT token in the header."

EXPIRED_JWT_CODE = 5
EXPIRED_JWT_HTTP = 401
EXPIRED_JWT_MSG = "Expired JWT token in the header."

INVALID_CLAIMS_CODE = 6
INVALID_CLAIMS_HTTP = 401
INVALID_CLAIMS_MSG = "Invalid claims in JWT token."
