import classes from "./MessageBox.module.css";

interface MessageBoxProps {
  message: string;
  onConfirm?: (() => void) | null;
  onCancel?: (() => void) | null;
  onConfirmText?: string;
  onCancelText?: string;
}

function MessageBox({
  message,
  onConfirm = null,
  onCancel = null,
  onConfirmText = "Confirm",
  onCancelText = "Cancel",
}: MessageBoxProps) {
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
