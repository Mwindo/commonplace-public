import { useContext, useEffect } from "react";
import classes from "./AddOrEditItem.module.css";
import { gql } from "graphql-request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ModalContext } from "./modals/ModalProvider";
import LoadingIcon from "./LoadingIcon";
import { Navigate, useSearchParams } from "react-router-dom";
import { ADD_ITEM_ID } from "./utilities/itemCardUtilities";
import { GQLQueryContext } from "./requests/GQLQueryProvider";
import MessageBox from "./modals/MessageBox";
import { MakeSplitStringComponent } from "./utilities/stringOperations";
import textStyles from "../styling/TextStyles.module.css";
import { setItemCardPreviewData } from "./utilities/itemCardPreview";

// TODO: Consider using React Hook Form (or Formik, although I haven't loved it in the past) and yup.

const existingItemDataQuery = gql`
  query itemDetails($ids: [Int]) {
    item_list(ids: $ids) {
      items {
        title
        description
        image_url
        thumbnail_url
        external_url
        content
        tags
      }
    }
  }
`;

// To get the fields the user needs to fill in.
const addOrEditItemFieldsQuery = gql`
  query getFields {
    add_or_edit_item_fields {
      field_name
      display_name
      type
      required
    }
  }
`;

const addOrEditItemMutation = gql`
  mutation addOrEditItem($input: ItemInput) {
    add_or_edit_item(data: $input) {
      id
    }
  }
`;

// TODO: Obviously janky. Instead, we should use a dropdown component to select existing tags or add new ones.
const splitTagString = (tagString) => {
  if (!tagString) return tagString;
  return tagString.toString().split(",");
};

function AddOrEditItem({ itemId, setDirty = () => {}, onSave }) {
  const {
    showErrorMessage,
    closeAllModals,
    showAlertDialogue,
    closeAlertDialogue,
  } = useContext(ModalContext);

  // We keep track of the original input values and the current input values
  // to check if the form is dirty.
  const [originalInputValues, setOriginalInputValues] = useState({});
  const [inputValues, setInputValues] = useState({});
  setDirty = setDirty || (() => {});

  const { gqlFetch } = useContext(GQLQueryContext);

  // Whenever the input values change, check if the form is dirty.
  useEffect(() => {
    // This is a place where a third-party library would be better
    const updateFormIsDirty = () => {
      for (const i in inputValues) {
        if (inputValues[i] !== originalInputValues[i]) {
          setDirty(true);
          return;
        }
      }
      setDirty(false);
    };
    updateFormIsDirty();
  }, [inputValues, originalInputValues, setDirty]);

  // The request for getting the fields the user needs to enter.
  const fetchAddOrEditItemFields = async () => {
    const data = await gqlFetch(addOrEditItemFieldsQuery);
    return data["add_or_edit_item_fields"];
  };

  const addOrEditItemFieldsData = useQuery({
    queryKey: ["itemFields"],
    queryFn: fetchAddOrEditItemFields,
    onError: showErrorMessage,
  });

  // The request for getting any existing data that goes into the fields the user needs to enter.
  const fetchExistingItemData = async () => {
    const data = await gqlFetch(existingItemDataQuery, {
      ids: [parseInt(itemId)],
    });
    setOriginalInputValues(data["item_list"]["items"][0]);
    setInputValues(data["item_list"]["items"][0]);
    return data["item_list"]["items"][0];
  };

  const existingItemData = useQuery({
    queryKey: ["existing_data"],
    queryFn: fetchExistingItemData,
    enabled: itemId !== ADD_ITEM_ID,
    refetchOnWindowFocus: false,
  });

  // The request for updating the item with what the user has entered.
  const sendAddOrEditRequest = async (data) => {
    return await gqlFetch(addOrEditItemMutation, data);
  };

  const addOrEditItem = useMutation({
    mutationFn: sendAddOrEditRequest,
    onSuccess: onSave,
    onError: (e) => showErrorMessage(e.message),
  });

  // The function to run when the add or edit form is submitted.
  const handleSubmitAddOrEdit = (e) => {
    e.preventDefault();
    addOrEditItem.mutate({
      input: { id: itemId, ...inputValues },
    });
  };

  // This would be a good place for useCallback if performance issues arise.
  const updateInputValue = (fieldName, value) => {
    if (fieldName === "tags") {
      value = splitTagString(value);
    }
    setInputValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  // We automatically add the currently selected tag to the form
  const [searchParams] = useSearchParams();
  const tagsearch = searchParams.get("tagsearch") || null;
  useEffect(() => {
    updateInputValue("tags", [tagsearch]);
  }, [tagsearch]);

  const handlePreviewClicked = (e) => {
    e.preventDefault();
    setItemCardPreviewData(JSON.stringify(inputValues));
    window.open("/preview");
  };

  // If we are loading data, show the loading icon.
  if (
    addOrEditItemFieldsData.isLoading ||
    addOrEditItemFieldsData.isRefetching ||
    existingItemData.isLoading ||
    existingItemData.isRefetching
  ) {
    return <LoadingIcon />;
  }

  if (existingItemData.isError) {
    closeAllModals();
    return <Navigate to="/networkerror" />;
  }

  // If we are not loading, show the form.
  return (
    <div className={classes.add_or_edit_item_container}>
      <h2 role="heading">
        {itemId !== ADD_ITEM_ID ? "Editing Item" : "Adding Item"}
      </h2>
      <form onSubmit={handleSubmitAddOrEdit}>
        <fieldset
          className={classes.fieldset}
          disabled={addOrEditItem.isPending}
        >
          {!addOrEditItemFieldsData.isLoading &&
            addOrEditItemFieldsData["data"].map((field) => {
              return (
                // Render the right input type, with a label, for each field the user can modify.
                <span
                  className={classes.span}
                  key={`${field["field_name"]}-span`}
                >
                  <label htmlFor={field["field_name"]}>
                    {field["display_name"]}
                  </label>
                  {field["type"] === "text" && (
                    <input
                      className={classes.border_box}
                      onChange={(e) =>
                        updateInputValue(field["field_name"], e.target.value)
                      }
                      type="text"
                      name={field["field_name"]}
                      id={field["field_name"]}
                      required={field["required"]}
                      defaultValue={inputValues[field["field_name"]]}
                    />
                  )}
                  {field["type"] === "textarea" && (
                    <textarea
                      onChange={(e) =>
                        updateInputValue(field["field_name"], e.target.value)
                      }
                      rows={20}
                      name={field["field_name"]}
                      id={field["field_name"]}
                      required={field["required"]}
                      defaultValue={inputValues[field["field_name"]]}
                    />
                  )}
                </span>
              );
            })}

          <div className={classes.save_container}>
            <button type="submit" className={classes.save_button}>
              {addOrEditItem.isPending ? (
                <LoadingIcon
                  className={classes.save_button_loading}
                  size={"2.2em"}
                />
              ) : (
                "Save"
              )}
            </button>
            <button
              className={classes.preview_button}
              onClick={handlePreviewClicked}
            >
              Preview
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default AddOrEditItem;
