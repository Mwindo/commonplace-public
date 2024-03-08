import classes from "./ModalWrapper.module.css";

function AlertDialogueWrapper({ children }) {
  // TODO: use SASS, inherit from the classes rather than setting style here, and manage z-indices in some shared place
  return (
    <div className={classes.modal_wrapper} style={{ zIndex: 18 }}>
      <div className={classes.modal_background} style={{ zIndex: 17 }}></div>
      <div role="alertdialog" className={classes.modal_box} style={{ zIndex: 18 }}>
        <div className={classes.modal_inner}>{children}</div>
      </div>
    </div>
  );
}

export default AlertDialogueWrapper;
