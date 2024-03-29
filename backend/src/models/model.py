from abc import ABC

import pymysql
from db import get_db
from werkzeug.security import generate_password_hash


class Model(ABC):

    table_name = ""

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

    # For models, we probably don't care about equality by reference.
    # Therefore, we override __eq__ for easy testing.
    def __eq__(self, __value: object) -> bool:
        if type(self) != type(__value):
            return False
        fields = [field for field in dir(self) if not field.startswith("_")]
        for field in fields:
            if getattr(self, field) != getattr(__value, field):
                return False
        return True
