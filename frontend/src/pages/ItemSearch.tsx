import ItemCard from "../components/ItemCard";
import ItemCardList from "../components/ItemCardList";
import SearchBar from "../components/SearchBar";
import { motion } from "framer-motion";
import { gql } from "graphql-request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingIcon from "../components/LoadingIcon";
import { useCallback, useContext, useEffect, useState } from "react";
import { LoginContext } from "../components/auth/Auth";
import { Navigate, useSearchParams } from "react-router-dom";
import NoResults from "../components/layout/NoResults";
import { ADD_ITEM_ID } from "../components/utilities/itemCardUtilities";
import classes from "./ItemSearch.module.css";
import { GQLQueryContext } from "../components/requests/GQLQueryProvider";
import { ItemData } from "./ItemDetails";

const itemsQuery = gql`
  query items($tag: String, $search: String) {
    item_list(tag: $tag, search: $search) {
      items {
        id
        title
        description
        image_url
        thumbnail_url
        tags
      }
    }
  }
`;

// TODO: Probably should merge this with itemsQuery to avoid an extra request
const getTagsQuery = gql`
  query getTagsQuery {
    get_tags
  }
`;

const removeItemMutation = gql`
  mutation removeItem($id: Int!) {
    remove_item(id: $id) {
      id
    }
  }
`;

function ItemSearchPage() {
  /*
    This page features a search bar, a tag selector, and item cards corresponding
    to the search term and selected tag. It is the "main" page of the app.
    When logged in, the user can add, edit, and remove items.
  */

  // Get the URL query params for the search bar text and the selected tag.
  const [searchParams, setSearchParams] = useSearchParams();

  // We'll associate the state of the search bar text and the selected tag
  // with the URL query params.
  const [searchBarText, setSearchBarText] = useState(
    searchParams.get("tagsearch") || ""
  );
  const [selectedTag, setSelectedTag] = useState(
    searchParams.get("tagsearch") || ""
  );

  useEffect(() => {
    // Update state when search params change.
    setSelectedTag(searchParams.get("tagsearch") || "");
    setSearchBarText(searchParams.get("textsearch") || "");
  }, [searchParams]);

  // If the user is logged in, we will allow CRUD operations.
  const { isAuth } = useContext(LoginContext);

  // Sometimes, we need to manually reload the items by invalidating queries.
  // For example, when a child component creates a new item.
  const queryClient = useQueryClient();

  const reloadItems = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["items"] });
    queryClient.invalidateQueries({ queryKey: ["tags"] });
  }, [queryClient]);

  // The query function for getting the items associated with out
  // (possibly empty) search term and (possibly empty) selected tag.
  const fetchItemsData = async () => {
    const response = await gqlFetch(itemsQuery, {
      tag: selectedTag,
      search: searchBarText,
    });
    const data = response["item_list"]["items"];
    if (isAuth && !searchBarText)
      return [
        { title: "Add New Item", id: ADD_ITEM_ID, image: "none" },
        ...data,
      ];
    return data;
  };

  // The query function for getting all of the available tags
  // a user can select.
  const fetchTagsData = async () => {
    return await gqlFetch(getTagsQuery);
  };

  const itemsData = useQuery({
    queryKey: ["items", selectedTag, searchBarText], // invalidate on new search term or selected tag
    queryFn: fetchItemsData,
    refetchOnWindowFocus: false,
  });

  const tagsData = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTagsData,
    refetchOnWindowFocus: false,
  });

  const { gqlFetch } = useContext(GQLQueryContext);

  const sendRemoveItemRequest = async (id: number) => {
    return await gqlFetch(removeItemMutation, { id });
  };

  const removeItem = useMutation({
    mutationFn: sendRemoveItemRequest,
    onSuccess: reloadItems,
  });

  // This would be a good place for useCallback if performance issues arise.
  const onSearch = (value: string) => {
    if (searchBarText === value) return; // Nothing to update
    setSearchBarText(value); // Otherwise, keep the search text state and its corresponding query param in sync
    searchParams.delete("textsearch");
    if (value) searchParams.set("textsearch", value);
    setSearchParams(searchParams);
  };

  // This function is very similar to onSearch.
  // If more of this functionality is needed, abstract the logic into a separate function.
  const onTagSelect = (value: string) => {
    if (selectedTag === value) return; // Nothing to update
    setSelectedTag(value); // Otherwise, keep the selected tag state and its corresponding query param in sync
    searchParams.delete("tagsearch");
    if (value) searchParams.set("tagsearch", value);
    setSearchParams(searchParams);
  };

  const dataIsBeingFetched =
    itemsData.isLoading ||
    itemsData.isFetching ||
    removeItem.isPending ||
    tagsData.isLoading ||
    tagsData.isFetching;

  const isError = itemsData.isError || tagsData.isError;

  // Seems redundant? isError doesn't seem to work when one navigates to another tab and then comes back.
  if (isError || (!dataIsBeingFetched && (!tagsData.data || !itemsData.data))) {
    return <Navigate to={"/networkerror"} />;
  }

  return (
    <motion.div
      initial={{ y: -1000 }}
      animate={{ y: 0 }}
      className={classes.item_search_container}
    >
      {dataIsBeingFetched ? (
        <div className={classes.search_bar_loading}></div>
      ) : (
        <SearchBar
          // This would be a good opportunity for useMemo if performance issues arise.
          tagOptions={tagsData.data["get_tags"].map((tag: string) => {
            return { value: tag, label: tag }; // this is the expected format for react-select
          })}
          selectedTag={selectedTag}
          onSearch={onSearch}
          onSelectTag={(value) => onTagSelect(value)}
          currentItems={itemsData["data"]}
          searchTerm={searchBarText}
        />
      )}
      {dataIsBeingFetched ? (
        <LoadingIcon />
      ) : itemsData["data"].length > 0 ? (
        <ItemCardList
          items={itemsData["data"]}
          onDelete={(id: number) => removeItem.mutate(id)}
          reloadItems={reloadItems}
          pageDecrementText={searchBarText ? "More relevant" : "Newer"}
          pageIncrementText={searchBarText ? "Less relevant" : "Older"}
          showCount={searchBarText + selectedTag ? true : false}
        />
      ) : (
        <NoResults />
      )}
    </motion.div>
  );
}

export default ItemSearchPage;
