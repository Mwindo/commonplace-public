from flask import g, current_app
import pymysql.cursors


ITEM_TABLE = "Item"
TAG_TABLE = "ItemTagMapping"
AUTHOR_TABLE = "Author"


class database_connection:

    connection: pymysql.Connection

    def __init__(self, app):
        self.connection = pymysql.connect(
            host=app.config["MYSQL_DATABASE_HOST"],
            user=app.config["MYSQL_DATABASE_USER"],
            password=app.config["MYSQL_DATABASE_PASSWORD"],
            database=app.config["MYSQL_DATABASE_DB"],
            cursorclass=pymysql.cursors.DictCursor,
        )
        self.cursor = self.connection.cursor()


def get_db():
    if "db" not in g:
        g.db = database_connection(current_app)
    return g.db


def init_conn(app):
    g.db = database_connection(app)
    app.teardown_appcontext(close_db)


def drop_all_tables(app):
    db = get_db()
    db.cursor.execute("DROP TABLE IF EXISTS `ItemTagMapping`")
    db.cursor.execute("DROP TABLE IF EXISTS `Item`")
    db.cursor.execute("DROP TABLE IF EXISTS `Author`")
    db.connection.commit()


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.cursor.close()
        db.connection.close()
