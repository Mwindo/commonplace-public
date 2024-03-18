import pytest

from db import get_db, drop_all_tables
from app import create_app, AppEnvironment
from flask import current_app


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

    print('tearing down')
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
    from models.model import create_all_tables
    # Setup the database session
    db = get_db()

    create_all_tables()

    yield db

    drop_all_tables(current_app)
