from db import get_db, ITEM_TABLE, TAG_TABLE
from exceptions.service_exceptions import TagTooLongException, TooManyTagsException
from models.item import ItemDetails

MAX_TAG_LENGTH = 32
MAX_NUM_TAGS = 12


def edit_item(item: ItemDetails, commit: bool = True):
    db = get_db()
    query = (
        f"UPDATE {ITEM_TABLE} SET "
        "`title`=%s,`description`=%s,"
        "`content`=%s, `external_location`=%s,`image_url`=%s,"
        "`thumbnail_url`=%s,`author_id`=%s,"
        "`date_updated`=CURRENT_TIMESTAMP WHERE id=%s"
    )
    db.cursor.execute(
        query,
        (
            item.title,
            item.description,
            item.content,
            item.external_location,
            item.image_url,
            item.thumbnail_url,
            item.author_id,
            item.id,
        ),
    )
    update_tags(item.id, item.tags)
    if commit:
        db.connection.commit()


def add_item(item: ItemDetails, commit: bool = True):
    db = get_db()
    query = (
        f"INSERT INTO {ITEM_TABLE} (`id`, `title`, `description`"
        ", `content_url`, `content`, `external_location`, "
        "`image_url`, `thumbnail_url`, `author_id`, `date_posted`,"
        "`date_updated`) VALUES (DEFAULT,%s,%s,"
        "'',%s,%s,%s,%s,"
        "%s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);"
    )
    db.cursor.execute(
        query,
        (
            item.title,
            item.description,
            item.content,
            item.external_location,
            item.image_url,
            item.thumbnail_url,
            item.author_id,
        ),
    )
    item.id = db.cursor.lastrowid  # Get the newly inserted row id
    update_tags(item.id, item.tags)
    if commit:
        db.connection.commit()


def update_tags(item_id: int, tags: list[str], commit: bool = False):
    cleaned_tags = clean_tags(tags)
    if len(cleaned_tags) > MAX_NUM_TAGS:
        raise TooManyTagsException(f"A maximum of {MAX_NUM_TAGS} tags is allowed")
    db = get_db()
    # We remove all tags associated with the item from the mapping
    db.cursor.execute(f"DELETE FROM {TAG_TABLE} WHERE item_id = %s;", item_id)
    if cleaned_tags:
        # We add all tags now associated with the item to the mapping
        tags_mapping_string = ", ".join(["(%s, %s)" for _ in cleaned_tags])
        add_tags_mapping = (
            f"INSERT IGNORE INTO {TAG_TABLE} values {tags_mapping_string};"
        )
        db.cursor.execute(
            add_tags_mapping,
            [param for tag in cleaned_tags for param in (tag, item_id)],
        )
    if commit:
        db.connection.commit()


def clean_tags(tags: list[str]) -> list[str]:
    cleaned_tags = set()
    for tag in tags:
        cleaned_tag = tag.strip()
        if not cleaned_tag:
            continue  # skip empty tag
        if len(cleaned_tag) > MAX_TAG_LENGTH:
            raise TagTooLongException(
                f"The tag {cleaned_tag[:MAX_TAG_LENGTH]}... is too long. "
                f"(A maximum of {MAX_TAG_LENGTH} characters is allowed.)"
            )
        cleaned_tags.add(cleaned_tag)
    return list(cleaned_tags)


def remove_item(item_id: int, commit: bool = True):
    db = get_db()
    # We'll just rely on edits to fail if concurrent with a delete,
    # i.e., no locking. We rely on FK check to remove entries in
    # ItemTagMapping.
    query = f"DELETE FROM {ITEM_TABLE} WHERE id = %s;"
    db.cursor.execute(query, item_id)
    if commit:
        db.connection.commit()
