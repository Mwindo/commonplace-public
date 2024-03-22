import { GraphQLClient } from "graphql-request";
import { isProductionEnvironment } from "../utilities/environment";

const endpoint = isProductionEnvironment()
  ? "https://commonplace.enigmatographer.com/graphql"
  : "http://dev.commonplace.com:5000/graphql";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(";").shift();
}

export const getGQLQueryClient = () => {
  return new GraphQLClient(endpoint, {
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCookie("csrf_access_token") || "",
    },
  });
};
