from ariadne import graphql_sync
from ariadne.explorer import ExplorerGraphiQL
import api.public as public_schema
from flask import request, make_response, current_app
from flask.globals import current_app
from flask.json import jsonify
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    unset_jwt_cookies,
    get_jwt_identity,
    get_jwt,
    verify_jwt_in_request,
)
from datetime import timedelta, datetime, timezone
from app import AppEnvironment


explorer_html = ExplorerGraphiQL().html(None)


# Set more dynamically as needed
ALLOW_ORIGIN = (
    "http://dev.commonplace.com"
    if current_app.config["ENVIRONMENT"] == AppEnvironment.DEV.value
    else "https://commonplace.enigmatographer.com"
)


@current_app.route("/public/graphql", methods=["GET", "OPTIONS", "POST"])
def graphql_public_explorer():
    # On GET request serve the GraphQL explorer.
    return explorer_html, 200


# GraphQL queries are always sent as POST
@current_app.route("/graphql", methods=["GET", "POST", "OPTIONS"])
def public_graphql_server():
    if request.method == "GET":
        return explorer_html, 200
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    data = request.get_json()

    success, result = None, None

    # Note: Passing the request to the context is optional.
    # In Flask, the current request is always accessible as flask.request
    success, result = graphql_sync(
        public_schema.schema,
        data,
        context_value={"request": request},
        debug=current_app.debug,
    )

    status_code = 200 if success else 400
    response = jsonify(result)

    response = handle_auth_for_response(result, response)
    return _corsify_actual_response(response), status_code


# There is no reason to do all of this on every request.
# TODO: Refactor.
def handle_auth_for_response(result, response):
    # This is a hack.
    if id := result.get("data", dict()).get("login", dict()).get("id", ""):
        access_token = create_access_token(identity=id)
        set_access_cookies(response, access_token)
    # So is this.
    elif result.get("data", dict()).get("logout", False):
        unset_jwt_cookies(response)
    else:
        response = refresh_expiring_token(response)
    return response


# While user is actively making requests, we will automatically
# refresh an expiring token.
# In the future, consider using a refresh token.
def refresh_expiring_token(response):
    try:
        verify_jwt_in_request()
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except Exception:  # TODO: more granular error catching
        return response


# A POST request first sends a preflight request to approve the request.
# Since we are allowing CORS, we need to set the appropriate preflght headers.
def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", ALLOW_ORIGIN)
    response.headers.add("Access-Control-Allow-Headers", "content-type,x-csrf-token")
    response.headers.add("Access-Control-Allow-Methods", "*")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response


# Set the appropriate CORS headers for the actual POST response.
def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", ALLOW_ORIGIN)
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response
