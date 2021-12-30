import urllib.parse
import os
from datetime import timedelta
from flask import Flask
from flask_jwt_extended import create_access_token, JWTManager

# USER_ID = "5eea67db4a6eaaccfacae0a1"  # jacek.miloszewski@gmail.com
USER_ID = "5f70cc599dda015fddcab809"

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.environ["FLASK_SECRET"]
jwt = JWTManager(app)


@app.route('/')
def hello_world():
    reset_token = create_access_token(
        identity=USER_ID,
        user_claims=['password_reset'],
        expires_delta=timedelta(days=365),
    )

    link = urllib.parse.urljoin("https://hammergen.net", "/resetPassword/{reset_token}".format(reset_token=reset_token))

    return link


if __name__ == '__main__':
    app.run()
