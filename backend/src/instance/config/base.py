import os
from datetime import timedelta

# Define the database connection
MYSQL_DATABASE_USER = os.environ.get("DATABASE_USER")
MYSQL_DATABASE_PASSWORD = os.environ.get("DATABASE_PASSWORD")
MYSQL_DATABASE_DB = os.environ.get("DATABASE_DB")
MYSQL_DATABASE_HOST = os.environ.get("DATABASE_HOST")

# Configure flask-jwt-extended
JWT_SECRET_KEY = "5E904E53B6FB011E366DCF723EDC01E3714CD42B5774E56AC1C7F08640EE6211"
JWT_COOKIE_SECURE = False  # SET THIS TO TRUE IN PRODUCTION
JWT_TOKEN_LOCATION = ["cookies"]
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=6)  # timedelta(seconds=20)
JWT_ACCESS_COOKIE_NAME = "commonplace_access_token_cookie"

SECRET_KEY = "9182305b56481550fb16aafe6be6e6a71e0b7152374dc57e853404e2f9f19317"

PORT = 5000
ENVIRONMENT = "base"  # Note that this config should never be used itself!
