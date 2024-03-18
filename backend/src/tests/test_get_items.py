from services import add_edit_remove_item
from services import auth
from models.item import ItemDetails
from models.author import Author
from conftest import *

TEST_ITEMS_QUERY = """
  query items($tag: String, $search: String) {
    item_list(tag: $tag, search: $search) {
      items {
        id
        title
        author
        description
        thumbnail_url
        tags
      }
    }
  }
"""


def test_add_author(app):
    print('test_add_author')
    print(app.config)
    author1 = Author(
        1,
        "Test Firstname 1",
        "Test Lastname 1",
        "Test Nickname 1",
        "Test Display Name 1",
        "Test Email 1",
        "Test Role 1",
        "Test Username 1",
        "Test Password 1",
    )
    auth.add_author(author1)
    authors = auth.get_authors()
    print(authors)
    assert len(authors) == 1
    assert author1 == authors[0]
    author2 = Author(
        2,
        "Test Firstname 2",
        "Test Lastname 2",
        "Test Nickname 2",
        "Test Display Name 2",
        "Test Email 2",
        "Test Role 2",
        "Test Username 2",
        "Test Password 2",
    )
    authors = auth.get_authors()
    assert len(authors) == 2
    assert author1 in authors
    assert author2 in authors

