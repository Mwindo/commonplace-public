import dataclasses
import datetime

from ariadne import MutationType, ObjectType, QueryType, gql, make_executable_schema
from ariadne.explorer import ExplorerGraphiQL
from flask import session
from flask.json import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from models.item import ItemDetails
from services import add_edit_remove_item, auth, item_info
from werkzeug.security import check_password_hash, generate_password_hash

type_defs = gql(
    """
    type Query {
        item_list(first: Int, skip: Int, ids: [Int], tag: String, search: String): ItemList
        get_tags: [String]
        add_or_edit_item_fields: [AddOrEditItemField]
        is_logged_in: Boolean!
    }
                
    type ItemList {
        items: [Item]
        count: Int!
    }
                
    type Item {
        id: Int!
        author: String
        title: String!
        description: String
        content: String!
        content_url: String
        image_url: String!
        thumbnail_url: String!
        external_url: String
        tags: [String]
    }
                
    type Mutation {
        login(username: String!, password: String!): LoginResult
        logout: Boolean
        add_or_edit_item(data: ItemInput): Item
        remove_item(id: Int): Item
    }
                
    type LoginResult {
        status: String!
        error: String
        id: Int
    }
                
    input ItemInput {
        id: Int!,
        title: String!,
        content: String!
        image_url: String!
        thumbnail_url: String
        external_url: String!
        description: String
        content_url: String
        tags: [String]
    }
                
    type AddOrEditItemField {
        field_name: String!,
        display_name: String!,
        type: String!,
        required: Boolean!
    }

"""
)


# Define the API objects
query = QueryType()
mutation = MutationType()
item_list = ObjectType("ItemList")
item = ObjectType("Item")
add_or_edit_item_field = ObjectType("AddOrEditItemField")


@query.field("get_tags")
def resolve_get_tags(*_):
    return item_info.get_tags()


@query.field("item_list")
def resolve_item_list(
    _,
    info,
    first: int = 0,
    skip: int = 0,
    ids: list[int] = None,
    tag: str = None,
    search: str = None,
):
    results = item_info.get_items(
        first=first, skip=skip, ids=ids, tag=tag, search=search
    )
    return results, len(results)


@query.field("add_or_edit_item_fields")
def resolve_add_or_edit_item_fields(*_):
    return ItemDetails.get_add_or_edit_fields()


@add_or_edit_item_field.field("type")
def resolve_type(item: ItemDetails.AddOrEditField, *_):
    return item.element_type


@add_or_edit_item_field.field("required")
def resolve_required(item: ItemDetails.AddOrEditField, *_):
    return item.required


@add_or_edit_item_field.field("display_name")
def resolve_display_name(item: ItemDetails.AddOrEditField, *_):
    return item.display_name


@add_or_edit_item_field.field("field_name")
def resolve_field_name(item: ItemDetails.AddOrEditField, *_):
    return item.field_name


@item_list.field("items")
def resolve_items(item_list: tuple[list[ItemDetails], int], info):
    return [item.to_api_response() for item in item_list[0]]


@item_list.field("count")
def resolve_items_count(item_list: tuple[list[ItemDetails], int], info) -> int:
    return item_list[1]


@query.field("is_logged_in")
def resolve_is_logged_in(*_):
    return auth.user_is_logged_in()


@mutation.field("login")
def resolve_login(_, info, username: str, password: str):
    return auth.login(username, password)


@mutation.field("logout")
def resolve_logout(_, info):
    return auth.logout()


@mutation.field("add_or_edit_item")
@jwt_required()
def resolve_add_or_edit_item(_, info, data: dict):

    def item_is_being_edited(item_data: ItemDetails):
        return item_data.id != -1

    item_id = int(data["id"])
    author_id = int(get_jwt_identity())
    tags: list[str] = data.get("tags") or []

    item_data = ItemDetails(
        id=item_id,
        author_id=author_id,
        title=data["title"],
        description=data["description"],
        external_location=data["external_url"],
        content=data["content"],
        content_url=data["content_url"],
        image_url=data["image_url"],
        thumbnail_url=data["thumbnail_url"],
        date_posted=None,
        date_updated=None,
        tags=tags,
    )
    if item_is_being_edited(item_data):
        add_edit_remove_item.edit_item(item_data)
    else:
        add_edit_remove_item.add_item(item_data)


@mutation.field("remove_item")
@jwt_required()
def resolve_remove_item(_, info, id: int):
    add_edit_remove_item.remove_item(id)


schema = make_executable_schema(
    type_defs, query, item_list, add_or_edit_item_field, mutation
)
