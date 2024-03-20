import pytest
from app import AppEnvironment, create_app
from db import create_all_tables, drop_all_tables, get_db
from flask import current_app
from models.author import Author

from services import auth
from models.item import ItemDetails
import datetime


TEST_AUTHOR_ID = 1


@pytest.fixture(scope="session")
def app():
    """
    Setup our Flask test app, this only gets executed once.

    :return: Flask app
    """

    _app = create_app(AppEnvironment.TEST.value)
    # Push an application context
    ctx = _app.app_context()
    ctx.push()

    yield _app

    # Pop the context and do cleanup after the test is done
    ctx.pop()

    # Teardown / cleanup can go here


@pytest.fixture(scope="session")
def client(app):
    """
    Setup an app client, this gets executed for each test function.

    :param app: Flask app
    :return: Flask app client
    """
    return app.test_client()


@pytest.fixture(scope="function")
def db(app):
    """
    Setup a database session for testing, this gets executed for each test function.
    """

    # Setup the database session
    db = get_db()

    create_all_tables()

    yield db

    drop_all_tables(current_app)


def get_test_author(id: int) -> Author:
    return Author(
        id,
        f"Test Firstname {id}",
        f"Test Lastname {id}",
        f"Test Nickname {id}",
        f"Test Display Name {id}",
        f"Test Email {id}",
        f"Test Role {id}",
        f"Test_Username_{id}",
        f"Test_Password_{id}",
    )


@pytest.fixture(scope="function")
def test_author(db):
    auth.add_author(get_test_author(TEST_AUTHOR_ID))


def get_test_item(id: int = 1, tags: list[str] | None = None) -> ItemDetails:
    return ItemDetails(
        id,
        TEST_AUTHOR_ID,
        f"Test Article Title {id}",
        f"Test Article Description {id}",
        f"Test Article External URL {id}",
        f"Test Article Content {id}",
        f"Test Article Content URL {id}",
        f"Test Article Image URL {id}",
        f"Test Article Thumbnail URL {id}",
        datetime.datetime.now(),
        datetime.datetime.now(),
        tags or [],
    )
