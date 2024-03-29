import { ReactNode, createContext, useCallback, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import AlertDialogueWrapper from "./AlertDialogueWrapper";
import MessageBox from "./MessageBox";

interface ModalContextProps {
  modal?: ReactNode;
  showModal: (
    modal: ReactNode,
    onCancel?: (() => void) | undefined,
    showCloseButton?: boolean
  ) => void;
  closeModal: () => void;
  alertDialogue?: ReactNode;
  showAlertDialogue: (dialogueComponent: ReactNode) => void;
  closeAlertDialogue: () => void;
  closeAllModals: () => void;
  showErrorMessage: (message: string) => void;
}

export const ModalContext = createContext<ModalContextProps>(
  {} as ModalContextProps
);

// TODO: Make more flexible as needed.
// E.g., rather than storing component directly, store state and rerender accordingly.
const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ReactNode | null>(null);
  const [alertDialogue, setAlertDialogue] = useState<ReactNode | null>(null);

  const showModal = useCallback(
    (
      modal: ReactNode,
      onCancel: (() => void) | undefined = undefined,
      showCloseButton: boolean = false
    ) => {
      setModal(
        <ModalWrapper onCancel={onCancel} showCloseButton={showCloseButton}>
          {modal}
        </ModalWrapper>
      );
    },
    []
  );

  const showAlertDialogue = useCallback(
    (dialogueComponent: ReactNode) => {
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
