from instance.config.base import *
import os

PORT = 8080
ENVIRONMENT = "production"

JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
JWT_COOKIE_SECURE = True

SECRET_KEY = os.environ.get("FLASK_SECRET_KEY")