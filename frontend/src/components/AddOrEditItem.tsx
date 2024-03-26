import {
  FormEventHandler,
  MouseEventHandler,
  useContext,
  useEffect,
} from "react";
import classes from "./AddOrEditItem.module.css";
import { gql } from "graphql-request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ModalContext } from "./modals/ModalProvider";
import LoadingIcon from "./LoadingIcon";
import { Navigate, useSearchParams } from "react-router-dom";
import { ADD_ITEM_ID } from "./utilities/itemCardUtilities";
import { GQLQueryContext } from "./requests/GQLQueryProvider";
import { setItemCardPreviewData } from "./utilities/itemCardPreview";
import { ItemData } from "../pages/ItemDetails";

// TODO: Consider using React Hook Form (or Formik, although I haven't loved it in the past) and yup.

// The shape of each individaul field.
interface Field {
  field_name: keyof ItemData;
  display_name: string;
  type: string;
  required: boolean;
}

// The query to retrieve data already associated with an object.
// TODO: better to use a fragment since this is also used for ItemSearch.
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

// The query to retrieve information on the fields the user needs to fill in.
/* TODO: Right now we dynamically get the fields ... but we have them more
or less hardcoded in our existingItemDataQuery. It would be best to link the
two, which would make things more dynamic and save a network trip. */
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
const splitTagString = (tagString: string): string[] => {
  if (!tagString) return [tagString];
  return tagString.toString().split(",");
};

function AddOrEditItem({
  itemId,
  setDirty = () => {},
  onSave,
}: {
  itemId: number;
  setDirty: (dirty: boolean) => void;
  onSave: () => void;
}) {
  const { showErrorMessage, closeAllModals } = useContext(ModalContext);

  // We keep track of the original input values and the current input values
  // to check if the form is dirty.
  const [inputValues, setInputValues] = useState<Partial<ItemData>>({});
  const [originalInputValues, setOriginalInputValues] = useState<
    Partial<ItemData>
  >({});

  const { gqlFetch } = useContext(GQLQueryContext);

  // Whenever the input values change, check if the form is dirty.
  useEffect(() => {
    // This is a place where a third-party library would be better
    const updateFormIsDirty = () => {
      const dirty =
        JSON.stringify(inputValues) !== JSON.stringify(originalInputValues);
      setDirty(dirty);
    };
    updateFormIsDirty();
  }, [inputValues, originalInputValues, setDirty]);

  // The request for getting the fields the user needs to enter.
  const fetchAddOrEditItemFields = async (): Promise<Field[]> => {
    const data = await gqlFetch(addOrEditItemFieldsQuery);
    if (!data) return [];
    return (data["add_or_edit_item_fields"] || []) as Field[];
  };

  const addOrEditItemFieldsData = useQuery({
    queryKey: ["itemFields"],
    queryFn: fetchAddOrEditItemFields,
  });

  // The request for getting any existing data that goes into the fields the user needs to enter.
  const fetchExistingItemData = async (): Promise<ItemData> => {
    const data = await gqlFetch(existingItemDataQuery, {
      ids: [itemId],
    });
    setOriginalInputValues(data["item_list"]["items"][0]);
    setInputValues(data["item_list"]["items"][0]);
    return data["item_list"]["items"][0] as ItemData;
  };

  const existingItemData = useQuery({
    queryKey: ["existing_data"],
    queryFn: fetchExistingItemData,
    enabled: itemId !== ADD_ITEM_ID,
    refetchOnWindowFocus: false, // We do not want to overwrite the user's entry
  });

  // The request for updating the item with what the user has entered.
  const sendAddOrEditRequest = async (data: ItemData) => {
    return await gqlFetch(addOrEditItemMutation, data);
  };

  const addOrEditItem = useMutation({
    mutationFn: sendAddOrEditRequest,
    onSuccess: onSave,
    onError: (e) => showErrorMessage(e.message),
  });

  // The function to run when the add or edit form is submitted.
  const handleSubmitAddOrEdit: FormEventHandler = (e) => {
    e.preventDefault();
    addOrEditItem.mutate({ id: itemId, ...inputValues } as ItemData);
  };

  // This would be a good place for useCallback if performance issues arise.
  const updateInputValue = <K extends keyof ItemData>(
    fieldName: K,
    value: ItemData[K]
  ) => {
    let newValue: ItemData[K] | string | string[] = value;
    if (fieldName === "tags" && typeof value === "string") {
      // Assuming splitTagString(value) correctly returns string[]
      newValue = splitTagString(value) as ItemData[K];
    }
    setInputValues((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  // We automatically add the currently selected tag to the form
  const [searchParams] = useSearchParams();
  const tagsearch = searchParams.get("tagsearch") || null;
  useEffect(() => {
    updateInputValue("tags", [tagsearch || ""]);
  }, [tagsearch]);

  const handlePreviewClicked: MouseEventHandler = (e) => {
    // We will save the preview data to storage and load it in a new window
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
      <h2>{itemId !== ADD_ITEM_ID ? "Editing Item" : "Adding Item"}</h2>
      <form onSubmit={handleSubmitAddOrEdit}>
        <fieldset
          className={classes.fieldset}
          disabled={addOrEditItem.isPending}
        >
          {!addOrEditItemFieldsData.isLoading &&
            addOrEditItemFieldsData.data?.map((field: Field) => {
              return (
                // Render the right input type, with a label, for each field the user can modify.
                <span className={classes.span} key={`${field.field_name}-span`}>
                  <label htmlFor={field.field_name}>{field.display_name}</label>
                  {field.type === "text" && (
                    <input
                      className={classes.border_box}
                      onChange={(e) =>
                        updateInputValue(field.field_name, e.target.value)
                      }
                      type="text"
                      name={field.field_name}
                      id={field.field_name}
                      required={field.required}
                      defaultValue={inputValues[field.field_name]}
                    />
                  )}
                  {field["type"] === "textarea" && (
                    <textarea
                      onChange={(e) =>
                        updateInputValue(field.field_name, e.target.value)
                      }
                      rows={20}
                      name={field.field_name}
                      id={field.field_name}
                      required={field.required}
                      defaultValue={inputValues[field.field_name]}
                    />
                  )}
                </span>
              );
            })}

          <div className={classes.save_container}>
            <button type="submit" className={classes.save_button}>
              {addOrEditItem.isPending ? (
                <LoadingIcon size={"2.2em"} />
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
