import dataclasses
from models.item import ItemDetails
from db import get_db, ITEM_TABLE, TAG_TABLE


# This is a total and insecure mess, obviously.
def get_items(
    first: int = 0,
    skip: int = 0,
    ids: list[int] = None,
    search: str = "",
    tag: str = "",
) -> list[ItemDetails]:
    """
    Return a list of items, filtered by any tag, ordered by post date
    if there is no search term, otherwise by relevance to the search term.
    """

    fields = [field.name for field in dataclasses.fields(ItemDetails)]
    order_by = " ORDER BY relevance DESC" if search else " ORDER BY date_posted DESC"

    search_query_part = ""
    ids_part = ""
    filter_part = ""
    if search:
        search_query_part = f", MATCH(title) AGAINST('{search}') * 5 + MATCH(content) AGAINST('{search}') as relevance"
        filter_part = " WHERE relevance > 0"
    if ids:
        ids_part = f" WHERE A.id IN ({','.join([str(id) for id in ids])})"
    query = (
        f"SELECT {', '.join(fields)} FROM "
        f"(SELECT {', '.join([f for f in fields if f != 'tags'])}, GROUP_CONCAT(tag_value) as tags{search_query_part}"
        f" FROM {ITEM_TABLE} A LEFT JOIN `ItemTagMapping` B On A.id = B.item_id{ids_part}"
        f" GROUP BY A.id) q {filter_part}"
    )
    if tag:
        query += f" {'AND' if search else 'WHERE'} FIND_IN_SET('{tag}', tags) > 0"
    query += f"{order_by};"
    db = get_db()
    db.cursor.execute(query)
    result_raw = db.cursor.fetchall()
    results = []
    for item in result_raw:
        item["tags"] = [s for s in item["tags"].split(",")] if item["tags"] else None
        results += [ItemDetails(**item)]
    if first:
        return results[skip : skip + first]
    else:
        return results[skip:]


def get_tags() -> list[str]:
    db = get_db()
    query = f"SELECT DISTINCT tag_value FROM {TAG_TABLE} ORDER BY tag_value ASC;"
    db.cursor.execute(query)
    tags = db.cursor.fetchall()
    return [tup['tag_value'] for tup in tags]
