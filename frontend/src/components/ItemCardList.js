import { useEffect, useState } from "react";
import classes from "./ItemCardList.module.css";
import { useSearchParams } from "react-router-dom";
import { itemCardIsAddItem } from "./utilities/itemCardUtilities";

// If the data set gets large, consider server-side pagination.
export const MAX_PAGE_SIZE = 12; // Divisible by 4, 3, 2, 1, which looks good on most screens

function ItemCardList({
  children,
  showCount,
  pageIncrementText,
  pageDecrementText,
}) {
  /*
    Display the ItemCards, paginated.

    Current pagination is basically a hack.
    I should be using a usePagination hook of some kind.
  */

  // First, get the pagination query param.
  const [searchParams, setSearchParams] = useSearchParams();
  const pageURLParam = parseInt(searchParams.get("page")) || 0;

  // Set the state to match the pagination query param.
  const [page, setPage] = useState(pageURLParam);

  /* 
    Reset the pagination when the component is reloaded.
    For instance, triggering a new search renders the old query param moot.
    I can't think of a reason why we would want the pagination to stay on any re-render,
    but if that happens, this will need to be more granular.
  */
  useEffect(() => {
      searchParams.delete("page");
      setSearchParams(searchParams);
      setPage(0);
  }, []);

  const numPages = Math.ceil(children.length / MAX_PAGE_SIZE);

  const getPageData = (page) => {
    return children.slice(
      page * MAX_PAGE_SIZE,
      page * MAX_PAGE_SIZE + MAX_PAGE_SIZE
    );
  };

  // Whenever we setPage, we should also update the pagination query param.
  // Call this to do so.
  const setPageAndURLParam = (page) => {
    setPage(page);
    searchParams.set("page", page);
    setSearchParams(searchParams);
  };

  return (
    <>
      {/* Filter out the Add Item Card, if present. */}
      {showCount
        ? children.filter((itemCard) => !itemCardIsAddItem(itemCard)).length +
          " results"
        : null}
      {/* Show the Item Card associated with the selected page. */}
      <div role="list" className={classes.item_list}>{getPageData(page)}</div>
      {/* Include a simple pagination bar. */}
      <div className={classes.simple_pagination_bar}>
        {page > 0 && (
          <div className={classes.simple_pagination_left}>
            <button
              aria-label={pageDecrementText}
              data-testid="item-card-list-paginate-left"
              className={classes.simple_pagination_button}
              onClick={() => setPageAndURLParam(Math.max(page - 1, 0))}
            >
              {`< ${pageDecrementText}`}
            </button>
          </div>
        )}
        {page < numPages - 1 && (
          <div className={classes.simple_pagination_right}>
            <button
              aria-label={pageIncrementText}
              className={classes.simple_pagination_button}
              data-testid="item-card-list-paginate-right"
              onClick={() =>
                setPageAndURLParam(Math.min(page + 1, numPages - 1))
              }
            >
              {`${pageIncrementText} >`}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ItemCardList;
