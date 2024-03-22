import ItemDetailsPage from "./ItemDetails";
import classes from "./PreviewItemDetails.module.css";
import {
  getItemCardPreviewData,
  removeItemCardPreviewData,
} from "../components/utilities/itemCardPreview";
import { useEffect } from "react";

function PreviewItemPage() {
  const previewData = getItemCardPreviewData();

  useEffect(() => {
    window.onbeforeunload = removeItemCardPreviewData; // We only want to store the preview data for the lifetime of the page.

    // Cleanup function to remove the event listener
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  return (
    <>
      <div className={classes.header_wrapper}>
        <h1>Preview</h1>
      </div>
      <div className={classes.preview_content_wrapper}>
        <ItemDetailsPage previewData={previewData}></ItemDetailsPage>
      </div>
    </>
  );
}

export default PreviewItemPage;
