import { useContext, useEffect } from "react";
import classes from "./ModalWrapper.module.css";
import { ModalContext } from "./ModalProvider";

function ModalWrapper({ onCancel, children, showCloseButton }) {
  const { closeModal } = useContext(ModalContext);

  onCancel = onCancel || closeModal;

  // Add key handlers for better accessibility
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel ? onCancel() : closeModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, closeModal]);

  return (
    <div className={classes.modal_wrapper}>
      <div onClick={onCancel} className={classes.modal_background}></div>
      <div className={classes.modal_box} role="dialog" aria-modal="true">
        <div className={classes.modal_inner}>
          {showCloseButton && (
            <button
              aria-hidden="true"
              aria-label="Close Dialogue"
              className={classes.modal_close_button}
              onClick={onCancel}
            >
              ✕
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default ModalWrapper;
