import os
import datetime

from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

from . import responses as r
from .user.claims import UserClaims

mongo = PyMongo()
jwt = JWTManager()
bcrypt = Bcrypt()

FLASK_SECRET_KEY = os.environ["FLASK_SECRET_KEY"]
MONGO_URI = os.environ["MONGO_URI"]
ACCESS_TOKEN_EXPIRES_MINUTES = int(os.environ["ACCESS_TOKEN_EXPIRES_MINUTES"])
REFRESH_TOKEN_EXPIRES_DAYS = int(os.environ["REFRESH_TOKEN_EXPIRES_DAYS"])


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=FLASK_SECRET_KEY,
        MONGO_URI=MONGO_URI,
        JWT_ACCESS_TOKEN_EXPIRES=datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES),
        JWT_REFRESH_TOKEN_EXPIRES=datetime.timedelta(days=REFRESH_TOKEN_EXPIRES_DAYS),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    mongo.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    CORS(app)

    from .user import controller as user_controller
    from .warhammer import controller as wh_controller

    app.register_blueprint(user_controller.user_bp)
    app.register_blueprint(wh_controller.wh_bp)

    @app.route("/api/keepwarm")
    def hello_world():
        return "OK"

    return app


@jwt.token_verification_loader
def token_verification(_, token):
    return UserClaims.USER.value in token["uc"]


@jwt.token_verification_failed_loader
def token_verification_failed(_, __):
    return r.api_response(r.INVALID_CLAIMS_CODE, r.INVALID_CLAIMS_MSG, r.INVALID_CLAIMS_HTTP)


@jwt.expired_token_loader
def expired_token(_, token_data):
    return r.api_response(r.EXPIRED_JWT_CODE, f"{r.EXPIRED_JWT_MSG} {token_data}.", r.EXPIRED_JWT_HTTP)


@jwt.invalid_token_loader
def invalid_token(error_msg):
    return r.api_response(r.INVALID_JWT_CODE, f"{r.INVALID_JWT_MSG} {error_msg}.", r.INVALID_JWT_HTTP)


@jwt.unauthorized_loader
def unauthorized(error_msg):
    return r.api_response(r.NO_JWT_CODE, f"{r.NO_JWT_MSG} {error_msg}.", r.NO_JWT_HTTP)
