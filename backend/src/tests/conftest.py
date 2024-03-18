import pytest

from db import get_db, drop_all_tables
from app import create_app, AppEnvironment


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
    db = get_db()
    db.cursor.execute('SHOW TABLES;')
    print('GO', db.cursor.fetchall())

    yield _app

    drop_all_tables(_app)

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
    # Setup the database session
    db = get_db()

    yield db

    # Teardown by dropping all tables
    db_name = app.config["MYSQL_DATABASE_DB"]
    db.cursor.execute(
        f"SELECT CONCAT('DROP TABLE IF EXISTS `', table_name, '`;') \
        FROM information_schema.tables WHERE table_schema = '{db_name}';"
    )
    db.connection.commit()
