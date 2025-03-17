import { useState, useCallback } from "react";
import { FileTypeWithEmpty } from "@/models/FileModel";

export const useFileModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileType, setFileType] = useState<FileTypeWithEmpty>("");
  const [modalZIndex, setModalZIndex] = useState(1000);
  const [onSelectFileCallback, setOnSelectFileCallback] = useState<
    ((fileUrl: string) => void) | null
  >(null);

  // Open Modal with provided callback, file type and zIndex
  const openModal = useCallback(
    (
      onSelectFile: (fileUrl: string) => void,
      type: FileTypeWithEmpty = "",
      zIndex = 1000
    ) => {
      setOnSelectFileCallback(() => onSelectFile);
      setFileType(type);
      setModalZIndex(zIndex);
      setIsModalOpen(true);
    },
    []
  );

  // Close Modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Handle file selection and execute callback
  const handleSelectFile = useCallback(
    (fileUrl: string) => {
      if (onSelectFileCallback) {
        onSelectFileCallback(fileUrl);
      }
      setIsModalOpen(false);
    },
    [onSelectFileCallback]
  );

  return {
    isModalOpen,
    fileType,
    modalZIndex,
    openModal,
    closeModal,
    handleSelectFile,
  };
};
