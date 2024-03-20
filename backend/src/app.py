import os
from datetime import datetime, timedelta, timezone
from enum import Enum

from flask import Flask
from flask_jwt_extended import (JWTManager, create_access_token, get_jwt,
                                get_jwt_identity, set_access_cookies)


class AppEnvironment(Enum):
    DEV = "dev"
    PRODUCTION = "production"
    TEST = "test"


def create_app(environment: str | None = None):
    # create and configure the application
    app = Flask(__name__, instance_relative_config=True)

    JWTManager(app)
    if not environment:
        environment = os.environ.get("ENVIRONMENT", AppEnvironment.DEV.value)
    app.config.update(SESSION_COOKIE_SAMESITE="Lax")
    app.config.from_pyfile(os.path.join("config", f"{environment}.py"))

    with app.app_context():
        import db
        import router  # This is needed, otherwise we will return 404s
        from models import model
        
        db.init_conn(app)

        # Setup the DB for local development
        if app.config['ENVIRONMENT'] in [AppEnvironment.DEV.value]:
            model.create_all_tables()
            # We'll initialize a local admin for dev testing
            model.create_dev_user()

    return app


def print_startup_string(app):
    print("Starting server...")
    print("------------------")
    print(f'ENVIRONMENT: {app.config["ENVIRONMENT"]}')
    print(f'PORT: {app.config["PORT"]}')


if __name__ == "__main__":
    app = create_app()
    app.run(threaded=True, host="0.0.0.0", port=5000, debug=True)
