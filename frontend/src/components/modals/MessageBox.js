import classes from "./MessageBox.module.css";

function MessageBox({
  message,
  onConfirm,
  onCancel,
  onConfirmText = "Confirm",
  onCancelText = "Cancel",
}) {
  return (
    <>
      <div className={classes.message_box_message}>{message}</div>
      <div className={classes.message_box_button_wrapper}>
        {onConfirm && (
          <button
            autoFocus
            aria-label="Confirm"
            className={classes.message_box_confirm}
            onClick={onConfirm}
          >
            {onConfirmText}
          </button>
        )}
        {onCancel && (
          <button
            aria-label="Cancel"
            className={classes.message_box_cancel}
            onClick={onCancel}
          >
            {onCancelText}
          </button>
        )}
      </div>
    </>
  );
}

export default MessageBox;
