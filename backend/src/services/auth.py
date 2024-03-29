import dataclasses

from db import get_db
from exceptions.service_exceptions import (
    InvalidArgumentsException,
    MissingArgumentsException,
)
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from models.author import Author
from pymysql import Error
from werkzeug.security import check_password_hash, generate_password_hash

MINIMUM_USERNAME_LENGTH = 4
MINIMUM_PASSWORD_LENGTH = 5


@dataclasses.dataclass
class LoginResponse:
    status: bool
    error: str
    id: int | None


def validate_login_string(string: str, min_length: int) -> tuple[bool, str]:
    """Check to ensure a username/password is valid and non-harmful, e.g., SQL injection attack."""
    if len(string) < min_length:
        return False
    allowed_chars = "abcdefghijklmnopqrstuvwxyz"
    allowed_chars += allowed_chars.upper() + "1234567890._"
    return all(char in allowed_chars for char in string)


def validate_safe_username(username: str) -> tuple[bool, str]:
    return validate_login_string(username, MINIMUM_USERNAME_LENGTH)


def validate_safe_password(password: str) -> tuple[bool, str]:
    return validate_login_string(password, MINIMUM_PASSWORD_LENGTH)


def login(username: str, password: str) -> LoginResponse:
    import datetime

    from models.item import ItemDetails
    from services.add_edit_remove_item import add_item

    """Check that the full login info is correct (in the DB)."""
    db = get_db()
    if not validate_safe_username(username):
        return LoginResponse(status=False, error="Invalid username", id=None)
    if not validate_safe_password(password):
        return LoginResponse(status=False, error="Invalid password", id=None)
    db.cursor.execute(
        f"SELECT * FROM {Author.table_name} WHERE username = %s", (username,)
    )
    user_info = db.cursor.fetchone()
    if user_info is None:
        return LoginResponse(status=False, error="Username not found", id=None)
    elif not check_password_hash(user_info["password"], password):
        return LoginResponse(status=False, error="Incorrect password", id=None)

    return LoginResponse(status=True, error="", id=int(user_info["id"]))


def update_user_password(password: str, author_id: int = 1):
    db = get_db()
    db.cursor.execute(
        f"UPDATE {Author.table_name} A SET A.password = %s WHERE A.id = %s;",
        generate_password_hash(password),
        author_id,
    )
    db.connection.commit()


def user_is_logged_in() -> bool:
    from datetime import datetime, timezone

    try:
        verify_jwt_in_request()
        exp_timestamp = get_jwt()["exp"]
        now = datetime.timestamp(datetime.now(timezone.utc))
        return exp_timestamp > now
    except Exception:
        return False


def logout():
    # We handle logout in routing to unset the cookies on the response object
    return True


def add_author(author: Author, commit: bool = True, hash_password: bool = True):
    query = f"INSERT INTO {Author.table_name} VALUES({author.id if author.id else 'DEFAULT'},"
    query += "%s, %s, %s, %s, %s, %s, %s, %s);"
    db = get_db()

    valid, missing_fields = author.validate_fields()
    if not valid:
        raise MissingArgumentsException(
            f'Missing required fields: {"".join(missing_fields)}'
        )

    if not validate_safe_username(author.username):
        # TODO: If user-facing, the error messages here need to be more granular
        raise InvalidArgumentsException("Username is invalid")
    if not validate_safe_password(author.password):
        raise InvalidArgumentsException("Password is invalid")

    db.cursor.execute(
        query,
        (
            author.first_name or "",
            author.last_name or "",
            author.nick_name or "",
            author.display_name
            or author.nick_name
            or f"{author.first_name} {author.last_name}",
            author.email or "",
            author.role or "",
            author.username,
            (
                generate_password_hash(author.password)
                if hash_password
                else author.password
            ),
        ),
    )
    if commit:
        db.connection.commit()


def get_authors(
    first: int = 0,
    skip: int = 0,
) -> list[Author]:
    query = f"SELECT * FROM {Author.table_name} ORDER BY id;"
    db = get_db()
    db.cursor.execute(query)
    result_raw = db.cursor.fetchall()
    results = []
    for author in result_raw:
        results += [Author(**author)]
    if first:
        return results[skip : skip + first]
    else:
        return results[skip:]


def remove_author(id: int) -> int:
    """
    Remove an author with a given id if such an author exists.
    Return the number of rows affected.
    """
    query = f"DELETE FROM {Author.table_name} WHERE id = %s"
    db = get_db()
    return db.cursor.execute(query, (id,))
