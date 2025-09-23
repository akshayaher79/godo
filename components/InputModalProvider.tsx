import React, { createContext, useCallback, useContext, useState } from "react";
import { Portal, Modal, Button, TextInput } from "react-native-paper";

type ModalData = {
  title: string;
  description: string;
};

type ModalContextType = {
  openModal: (
    options: {
      initialValues?: Partial<ModalData>;
      onSubmit?: (data: ModalData) => void;
      onDelete?: () => void;
    }
  ) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useInputModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useInputModal must be used inside InputModalProvider");
  return ctx;
};

export function InputModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [onSubmitCb, setOnSubmitCb] = useState<((d: ModalData) => void) | null>(null);
  const [onDeleteCb, setOnDeleteCb] = useState<(() => void) | null>(null);

  const reset = () => {
    setTitle("");
    setDescription("");
    setOnSubmitCb(null);
    setOnDeleteCb(null);
  };

  const openModal = useCallback(
    ({
      initialValues,
      onSubmit,
      onDelete,
    }: {
      initialValues?: Partial<ModalData>;
      onSubmit?: (data: ModalData) => void;
      onDelete?: () => void;
    }) => {
      setTitle(initialValues?.title ?? "");
      setDescription(initialValues?.description ?? "");
      setOnSubmitCb(() => onSubmit || null);
      setOnDeleteCb(() => onDelete || null);
      setVisible(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setVisible(false);
    reset();
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmitCb?.({ title, description });
    closeModal();
  }, [onSubmitCb, title, description, closeModal]);

  const handleDelete = useCallback(() => {
    onDeleteCb?.();
    closeModal();
  }, [onDeleteCb, closeModal]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={closeModal}
          contentContainerStyle={{ backgroundColor: "white", padding: 20, margin: 20 }}
        >
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            style={{ marginBottom: 12 }}
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={{ marginBottom: 12 }}
          />
          <Button mode="contained" onPress={handleSubmit}>
            Save
          </Button>
          {onDeleteCb && (
            <Button
              mode="outlined"
              textColor="red"
              onPress={handleDelete}
              style={{ marginTop: 8 }}
            >
              Delete
            </Button>
          )}
        </Modal>
      </Portal>
    </ModalContext.Provider>
  );
}
