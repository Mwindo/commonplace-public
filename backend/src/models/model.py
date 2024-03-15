from abc import ABC
from db import get_db
from werkzeug.security import generate_password_hash
import pymysql


class Model(ABC):

    def __init__(self) -> None:
        pass

    @classmethod
    def create_db_table(cls):
        db = get_db()
        db.cursor.execute(cls.table_creation_SQL())
        db.connection.commit()

    @classmethod
    def table_creation_SQL(cls):
        """
        This is the "I'm not using an ORM and don't want to write my own
        right now" hack. Each model should have SQL code for creating itself.
        """
        raise NotImplementedError("Model must implement create DB table")


def create_all_tables():
    from .item import ItemDetails
    from .author import Author
    from .tags import ItemTagMapping
    from db import get_db

    # The order here matters because of foreign keys
    # With a proper ORM, this wouldn't be an issue.
    for model in [Author, ItemDetails, ItemTagMapping]:
        model.create_db_table()


# TODO: This should be moved somewhere more logical
def create_dev_user():
    db = get_db()
    try:
        # We'll make sure an Admin is available for testing
        password_hash = generate_password_hash("TestPassword")
        db.cursor.execute(
            f"INSERT INTO AUTHOR VALUES(1, 'Test', \
            'User', 'Tester', 'Test User', 'fakeemail@123.com', \
            'Admin', 'Admin', '{password_hash}');"
        )
        db.connection.commit()
    except pymysql.err.IntegrityError:
        pass
