import { createContext, useCallback, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import AlertDialogueWrapper from "./AlertDialogueWrapper";
import MessageBox from "./MessageBox";

export const ModalContext = createContext();

// TODO: Make more flexible as needed.
// E.g., rather than storing component directly, store state and rerender accordingly.
const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);
  const [alertDialogue, setAlertDialogue] = useState(null);

  const showModal = useCallback(
    (modal, onCancel = null, showCloseButton = false) => {
      setModal(
        <ModalWrapper onCancel={onCancel} showCloseButton={showCloseButton}>
          {modal}
        </ModalWrapper>
      );
    },
    []
  );

  const showAlertDialogue = useCallback(
    (dialogueComponent) => {
      setAlertDialogue(
        <AlertDialogueWrapper>{dialogueComponent}</AlertDialogueWrapper>
      );
    },
    [setAlertDialogue]
  );

  const closeModal = useCallback(() => {
    setModal(null);
  }, [setModal]);

  const closeAlertDialogue = useCallback(() => {
    setAlertDialogue(null);
  }, [setAlertDialogue]);

  const closeAllModals = useCallback(() => {
    closeModal();
    closeAlertDialogue();
  }, [closeModal, closeAlertDialogue]);

  const showErrorMessage = useCallback(
    (message = "There was an error :(") => {
      showAlertDialogue(
        <MessageBox
          message={message}
          onConfirm={closeAlertDialogue}
          onConfirmText="Ok"
        />
      );
    },
    [showAlertDialogue, closeAlertDialogue]
  );

  return (
    <ModalContext.Provider
      value={{
        modal,
        showModal,
        closeModal,
        alertDialogue,
        showAlertDialogue,
        closeAlertDialogue,
        closeAllModals,
        showErrorMessage,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
