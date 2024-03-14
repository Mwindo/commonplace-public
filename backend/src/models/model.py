from abc import ABC
from db import get_db
from werkzeug.security import generate_password_hash


class Model(ABC):

    def __init__(self) -> None:
        pass

    @classmethod
    def create_db_table(cls):
        db = get_db()
        db.cursor.execute(cls.table_creation_SQL())

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
    Author.create_db_table()
    ItemDetails.create_db_table()
    ItemTagMapping.create_db_table()
    db = get_db()
    try:
        print('HERE! STILL!!')
        db.cursor.execute(f'INSERT INTO AUTHOR VALUES(1, "Test", "User", "Tester", "Test User", "fakeemail@123.com", "Admin", "Admin", "{generate_password_hash('password')}");')
        db.connection.commit()
    except Exception as e:
        print('ERROR', e)