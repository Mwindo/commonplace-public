import pymysql.cursors
from flask import current_app, g


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


def create_all_tables():
    from models.author import Author
    from models.item import ItemDetails
    from models.tags import ItemTagMapping

    # The order here matters because of foreign keys
    # With a proper ORM, this wouldn't be an issue.
    for model in [Author, ItemDetails, ItemTagMapping]:
        model.create_db_table()


def drop_all_tables(app):
    from models.author import Author
    from models.item import ItemDetails
    from models.tags import ItemTagMapping

    db = get_db()
    db.cursor.execute(f"DROP TABLE IF EXISTS `{ItemTagMapping.table_name}`")
    db.cursor.execute(f"DROP TABLE IF EXISTS `{ItemDetails.table_name}`")
    db.cursor.execute(f"DROP TABLE IF EXISTS `{Author.table_name}`")
    db.connection.commit()


def create_dev_user():
    from models.author import Author
    from services.auth import add_author

    try:
        # We'll make sure an Admin is available for testing
        add_author(
            Author(
                1,
                "Test",
                "User",
                "Test User",
                "Test User",
                "fakeemail123@host.com",
                "Admin",
                "Admin",
                "TestPassword",
            )
        )
    except pymysql.err.IntegrityError:
        pass


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.cursor.close()
        db.connection.close()
