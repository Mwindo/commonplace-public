import { motion } from "framer-motion";
import classes from "./ItemDetails.module.css";
import { useQuery } from "@tanstack/react-query";
import LoadingIcon from "../components/LoadingIcon";
import { gql } from "graphql-request";
import { Navigate, useParams } from "react-router-dom";
import TagBox from "../components/TagBox";
import { MakeSplitStringComponent } from "../components/utilities/stringOperations";
import { useContext } from "react";
import { GQLQueryContext } from "../components/requests/GQLQueryProvider";
import textStyles from "../styling/TextStyles.module.css";

const itemDetailsQuery = gql`
  query itemDetails($ids: [Int]) {
    item_list(ids: $ids) {
      items {
        title
        author
        image_url
        content
        tags
      }
    }
  }
`;

function ItemDetailsPage() {
  /*
    This page displays an item in its full form, i.e., with the content.
    In other words, this is a commonplace article.
  */

  const { itemId } = useParams();

  const { gqlFetch } = useContext(GQLQueryContext);

  // The function for getting the details from the backend
  const fetchItemData = async () => {
    const data = await gqlFetch(itemDetailsQuery, {
      ids: [parseInt(itemId)],
    });
    return data["item_list"]["items"][0];
  };

  const itemDetailsData = useQuery({
    queryKey: ["itemDetails", itemId],
    queryFn: fetchItemData,
  });

  // TODO: distinguish between not found and network error
  if (
    !itemId || // If there is no item id, then we can't find it
    itemDetailsData.isError || // If there is an error, either the id does not exist or we have a network issue
    (!itemDetailsData.isFetching && !itemDetailsData.data) // Seems redundant? isError doesn't seem to work when one navigates to another tab and then comes back.
  ) {
    return <Navigate to={"/notfound"} />;
  }

  return (
    <motion.div
      className={classes.item_details_container}
      // On enter is a slide up animation, on exit is a slide down animation
      initial={{ y: window.innerHeight }}
      animate={{ y: 0 }}
      exit={{
        y: window.innerHeight,
        opacity: 0,
        transition: { duration: 0.1 },
      }}
    >
      {itemDetailsData.isLoading ? (
        <LoadingIcon />
      ) : (
        <>
          <h1 role="heading" className={classes.title}>
            {itemDetailsData["data"]["title"]}
          </h1>
          <div
            className={classes.image}
            style={{
              backgroundImage: `url(${itemDetailsData["data"]["image_url"]})`,
            }}
          />
          <TagBox tags={itemDetailsData["data"]["tags"]} />
          <main role="main" className={textStyles.text_body}>
            {MakeSplitStringComponent(itemDetailsData["data"]["content"])}
          </main>
        </>
      )}
    </motion.div>
  );
}

export default ItemDetailsPage;
