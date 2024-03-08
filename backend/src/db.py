from flask import g
from flaskext.mysql import MySQL

mysql = MySQL()


ITEM_TABLE = "Item"
TAG_TABLE = "ItemTagMapping"
AUTHOR_TABLE = "Author"


class database_connection:

    def __init__(self):
        self.connection = mysql.connect()
        self.cursor = self.connection.cursor()


def get_db():
    if "db" not in g:
        g.db = database_connection()
    return g.db


def init_conn(app):
    mysql.init_app(app)
    app.teardown_appcontext(close_db)


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.cursor.close()
        db.connection.close()
