from services import add_edit_remove_item, item_info
from models.item import ItemDetails
from conftest import get_test_item


def fuzzy_item_equals(item1: "ItemDetails", item2: "ItemDetails"):
    """
    Check if two items are the same, minus slight differences
    in date_posted/date_updated times.
    """
    return all(
        [
            item1.id == item2.id,
            item1.title == item2.title,
            item1.description == item2.description,
            item1.content_url == item2.content_url,
            item1.content == item2.content,
            item1.external_location == item2.external_location,
            item1.image_url == item2.image_url,
            item1.thumbnail_url == item2.thumbnail_url,
            item1.author_id == item2.author_id,
            (item1.date_posted - item2.date_posted).total_seconds() < 1,
            (item1.date_updated - item2.date_updated).total_seconds() < 1,
            set(item1.tags) == set(item2.tags),
        ]
    )


def test_add_item(test_author):
    added_items = []
    for i in range(1, 4):
        item = get_test_item(i)
        added_items += [item]
        add_edit_remove_item.add_item(item)
        db_items = sorted(item_info.get_items(), key=lambda i: i.id)
        for index, item in enumerate(sorted(added_items, key=lambda i: i.id)):
            assert fuzzy_item_equals(item, db_items[index])


def test_remove_item(test_author):
    added_items = []
    for i in range(1, 4):
        item = get_test_item(i)
        added_items += [item]
        add_edit_remove_item.add_item(item)
    for i in reversed(range(1, 4)):
        added_items = [item for item in added_items if item.id != i]
        add_edit_remove_item.remove_item(i)
        db_items = sorted(item_info.get_items(), key=lambda i: i.id)
        for index, item in enumerate(sorted(added_items, key=lambda i: i.id)):
            assert fuzzy_item_equals(item, db_items[index])


def test_add_remove_tags(test_author):
    item1 = get_test_item(1, ["test tag 1"])
    item2 = get_test_item(2, ["test tag 2", "test tag 1"])
    # We'll add items
    add_edit_remove_item.add_item(item1)
    add_edit_remove_item.add_item(item2)
    # Then make sure we have the expected tags from those items
    assert set(item1.tags + item2.tags) == set(item_info.get_tags())
    assert len(item_info.get_items()) == 2
    # When we remove an item, its tag should no longer exist
    add_edit_remove_item.remove_item(item2.id)
    assert set(item1.tags) == set(item_info.get_tags())
    # When we remove the last item, no tags should exist
    add_edit_remove_item.remove_item(item1.id)
    assert len(item_info.get_tags()) == 0


def test_edit_item(test_author):
    item = get_test_item(1, ["test tag 1"])
    add_edit_remove_item.add_item(item)
    # We'll make a new item with the same id as an "edit"
    item_edited = get_test_item(2, ["test tag 2"])
    item_edited.id = 1
    # Set the same date_posted time (since editing will not change this)
    item_edited.date_posted = item.date_posted
    add_edit_remove_item.edit_item(item_edited)
    db_items = item_info.get_items()
    assert len(db_items) == 1
    assert fuzzy_item_equals(db_items[0], item_edited)


def test_pagination(test_author):
    # TODO: Improve this test
    for i in range(1, 4):
        add_edit_remove_item.add_item(get_test_item(i))
    # First make sure we get all the items
    assert len(item_info.get_items()) == 3
    # Then make sure if we specify first, we get the expected items
    db_items = item_info.get_items(1)
    assert len(db_items) == 1
    assert db_items[0].id == 1
    # Then make sure if we specify skip, we get the expected items
    db_items = item_info.get_items(first=-1, skip=1)
    assert len(db_items) == 2
    assert db_items[0].id == 2
    # Then make sure if we specify first and skip, we get the expected items
    db_items = item_info.get_items(1, 1)
    assert len(db_items) == 1
    assert db_items[0].id == 2


def test_search_items(test_author):
    # TODO: Improve.
    for i in range(1, 4):
        add_edit_remove_item.add_item(get_test_item(i))
    # Check search term shared by all returns all
    assert len(item_info.get_items(search="Test")) == 3
    # Check pagination still works
    assert len(item_info.get_items(2, 1, search="Test")) == 2
    # Check search term with no matches returns nothing
    assert len(item_info.get_items(search="Blah")) == 0
    # Check that the best result for a title search yields the article with that title
    assert item_info.get_items(search=get_test_item(1).title)[0].id == 1
    # Check that the best result for a content search yields the article with that content
    assert item_info.get_items(search=get_test_item(1).content)[0].id == 1


def test_filter_items_by_tag(test_author):
    for i in range(1, 4):
        add_edit_remove_item.add_item(get_test_item(i, [f"test tag {i}"]))
    items = item_info.get_items(tag="test tag 1")
    assert len(items) == 1
    assert items[0].id == 1
    add_edit_remove_item.add_item(get_test_item(4, ["test tag 1"]))
    items = item_info.get_items(tag="test tag 1")
    print(items)
    assert len(items) == 2
    assert set(i.id for i in items) == set([1, 4])


def test_filter_items_by_id(test_author):
    for i in range(1, 4):
        add_edit_remove_item.add_item(get_test_item(i, [f"test tag {i}"]))
    items = item_info.get_items(ids=[1, 3])
    assert len(items) == 2
    assert set(i.id for i in items) == set([1, 3])
