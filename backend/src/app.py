import os

from flask import Flask

from enum import Enum

from datetime import timedelta, datetime, timezone


from flask_jwt_extended import JWTManager
from flask_jwt_extended import (
    get_jwt,
    create_access_token,
    set_access_cookies,
    get_jwt_identity,
)


class AppEnvironment(Enum):
    DEV = "dev"
    PRODUCTION = "production"


def create_app(environment: str | None = None):
    # create and configure the application
    app = Flask(__name__, instance_relative_config=True)

    # app.config["JWT_COOKIE_DOMAIN"] = "http://dev.commonplace.com"
    JWTManager(app)
    if not environment:
        environment = os.environ.get("ENVIRONMENT", AppEnvironment.DEV.value)
    app.config.update(SESSION_COOKIE_SAMESITE="Lax")
    app.config.from_pyfile(os.path.join("config", f"{environment}.py"))

    with app.app_context():
        import db
        import router  # This is needed, otherwise we will return 404s

        db.init_conn(app)

        return app


app = create_app()


def print_startup_string():
    # Might be best to print all env variables?
    print("Starting server...")
    print("------------------")
    print(f'ENVIRONMENT: {app.config["ENVIRONMENT"]}')
    print(f'PORT: {app.config["PORT"]}')


if __name__ == "__main__":
    print_startup_string()
    app.run(threaded=True, host="0.0.0.0", port=5000, debug=True)


# Using an `after_request` callback, we refresh any token that is within 30
# minutes of expiring. Change the timedeltas to match the needs of your application.
# TODO: This isn't ever being hit?
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response
