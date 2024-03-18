from services import auth
from models.author import Author
from conftest import *
from exceptions.service_exceptions import InvalidArgumentsException


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


def test_add_invalid_author(db):
    author = get_test_author(1)
    original_username = author.username
    invalid_usernames = [
        'a', 'a#4asf', 'Hey there', 'Cooluser1?'
    ]
    invalid_passwords = [
        '123'
    ]
    for username in invalid_usernames:
        author.username = username
        with pytest.raises(InvalidArgumentsException):
            auth.add_author(author)
    author.username = original_username
    for password in invalid_passwords:
        author.password = password
        with pytest.raises(InvalidArgumentsException):
            auth.add_author(author)


def test_add_valid_author(db):
    added_authors = []
    for i in range(1, 4):
        author = get_test_author(i)
        added_authors += [author]
        auth.add_author(author, hash_password=False)
        db_authors = auth.get_authors()
        assert sorted(added_authors, key=lambda a: a.id) == sorted(
            db_authors, key=lambda a: a.id
        )


def test_remove_author(db):
    assert (
        auth.remove_author(12) == 0
    )  # Nonexistent author should not have been deleted
    added_authors = []
    # We'll add the authors
    for i in range(1, 4):
        author = get_test_author(i)
        added_authors += [author]
        auth.add_author(author, hash_password=False)
    # Then we'll remove them one by one and make sure we get the expected result each time
    for i in reversed(range(1, 4)):
        assert auth.remove_author(i) == 1
        added_authors = [author for author in added_authors if author.id != i]
        db_authors = auth.get_authors()
        assert sorted(added_authors, key=lambda a: a.id) == sorted(
            db_authors, key=lambda a: a.id
        )


def test_login(db):

    def failed_attempt(attempt: auth.LoginResponse) -> bool:
        return all([not attempt.status, attempt.error, attempt.id == None])

    def successful_attempt(author: Author, attempt: auth.LoginResponse) -> bool:
        return all([attempt.status, not attempt.error, attempt.id == author.id])

    author = get_test_author(1)
    auth.add_author(author)

    incorrect_credentials = [
        ("Should not work", "Should not work"),
        (author.username, "Should not work"),
        ("Should not work", author.password),
    ]

    for username, password in incorrect_credentials:
        assert failed_attempt(auth.login(username, password))

    assert successful_attempt(author, auth.login(author.username, author.password))
