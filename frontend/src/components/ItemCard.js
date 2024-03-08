import { Link, useLocation } from "react-router-dom";
import classes from "./ItemCard.module.css";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./auth/Auth";
import { ModalContext } from "./modals/ModalProvider";
import MessageBox from "./modals/MessageBox";
import AddOrEditItem from "./AddOrEditItem";
import { truncateText } from "./utilities/stringOperations";
import { ADD_ITEM_ID } from "./utilities/itemCardUtilities";

const getToolTipText = (itemID, title, description) => {
  if (itemID === ADD_ITEM_ID) return "Add New Item";
  return title + ": " + description;
};

const TITLE_MAX_NUM_CHARS = 54;

function ItemCard({
  itemId,
  itemImage,
  itemTitle,
  itemDescription,
  reloadItems = () => {},
  onDelete,
}) {
  /*
    A component to show a preview of the full item.
  */

  const { isAuth } = useContext(LoginContext);

  // When in the editing state, we show a modal.
  const [isEditing, setIsEditing] = useState(false);

  // Keep track of whether the modal edit form is dirty.
  const [hasEdits, setHasEdits] = useState(false);

  const {
    showModal,
    closeModal,
    closeAlertDialogue,
    showAlertDialogue,
    closeAllModals,
  } = useContext(ModalContext);

  useEffect(() => {
    if (!isEditing) return; // There is nothing to do if we aren't editing.

    // We show the add/edit component as a modal.
    showModal(
      <AddOrEditItem
        itemId={itemId}
        setDirty={setHasEdits}
        // When we save, we will show an alert dialogue to confirm.
        // Upon user confirmation, the we will close the modal and reload.
        // This means the component will rerender, and isEditing will be set to the default (false),
        // so there is no need to manually reset it here.
        onSave={() =>
          showAlertDialogue(
            <MessageBox
              message="Saved!"
              onConfirmText="OK"
              onConfirm={() => {
                reloadItems();
                closeAllModals();
              }}
            />
          )
        }
      />,
      // On cancel, we need to manually set isEditing to false. Otherwise, this useEffect will become useless.
      // If there were no edits, we go ahead and close without showing an alert.
      // If there were edits, make sure the user is ok losing them.
      () => {
        setIsEditing(false);
        if (!hasEdits) {
          closeModal();
          return;
        }
        showAlertDialogue(
          <MessageBox
            message="Leave without saving?"
            onConfirm={closeAllModals}
            onCancel={closeAlertDialogue}
            onConfirmText="Yes"
            onCancelText="No"
          />
        );
      },
      true // Show close button here so user has a visual sign that they can exit
    );
  }, [
    isEditing,
    hasEdits,
    reloadItems,
    itemId,
    closeAlertDialogue,
    closeAllModals,
    closeModal,
    showAlertDialogue,
    showModal,
  ]);

  // This would be a good place for useCallback if performance issues arise.
  const handleAddOrEditClicked = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  // This would be a good place for useCallback if performance issues arise.
  const handleRemoveItemClicked = (e) => {
    e.preventDefault();
    showModal(
      <MessageBox
        message={"Are you sure you want to delete this item?"}
        onConfirm={() => {
          closeModal();
          onDelete();
        }}
        onCancel={closeModal}
        onConfirmText="Yes"
        onCancelText="No!"
      />
    );
  };

  /* This is sort of hacky, but:
    1) In the case of existing data, we render the ItemCard as a link to the Item's route.
    2) If the user is logged in, however, we insert a "dummy" card to "Add New Item."
    In this second case, we want everything to look the same, but to "deactivate" the link
    and have it show the Add/Edit modal instead. We "deactivate" by pointing the link to the
    same location, including query parameters.
  */
  const location = useLocation();
  // This would be a good place for useMemo if performance issues arise, or if this
  // logic were abstracted into a separate hook.
  const linkDestination =
    itemId > 0 ? `/item/${itemId}` : location.pathname + location.search;
  const onLinkClick = itemId === ADD_ITEM_ID ? handleAddOrEditClicked : null;

  return (
    <Link
      title={getToolTipText(itemId, itemTitle, itemDescription)}
      to={linkDestination}
      onClick={onLinkClick}
      className={classes.item}
    >
      <div role="listitem" className={classes.inner_card}>
        <div
          className={classes.inner_card_top}
          style={{ backgroundImage: `url(${itemImage}` }}
        >
          {
            // Show the edit/remove options if the user is logged in
            isAuth && itemId !== ADD_ITEM_ID && (
              <div role="menubar" className={classes.edit_button_container}>
                <button
                  aria-label="Edit Item"
                  onClick={handleAddOrEditClicked}
                  className={classes.edit_button}
                >
                  Edit
                </button>
                <button
                  aria-label="Delete Item"
                  onClick={handleRemoveItemClicked}
                  className={classes.remove_button}
                >
                  Delete
                </button>
              </div>
            )
          }
        </div>
        <div className={classes.inner_card_bottom}>
          <p>{truncateText(itemTitle, TITLE_MAX_NUM_CHARS)}</p>
        </div>
      </div>
    </Link>
  );
}

export default ItemCard;
