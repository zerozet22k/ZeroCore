"use client";

import React, { useEffect } from "react";

import { FileContext } from "@/contexts/FileContext";
import FileSelectionModal from "@/components/inputs/FileSelectionModal";
import { useFetchFiles } from "@/hooks/useFetchFiles";
import { useFileModal } from "@/hooks/useFileModal";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useFirebaseConfig } from "@/hooks/useFirebaseConfig";

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { firebaseLoading, firebaseReady, checkFirebaseConfig } =
    useFirebaseConfig();
  const {
    files,
    setFiles,
    loading,
    syncing,
    hasMore,
    searchState,
    fetchFiles,
    clearFiles,
    deleteFile,
    syncFiles,
  } = useFetchFiles();

  const {
    uploading,
    uploadProgress,
    uploadedFiles,
    failedFiles,
    pendingFiles,
    addPendingFiles,
    removePendingFile,
  } = useFileUpload();

  const {
    isModalOpen,
    fileType,
    modalZIndex,
    openModal,
    closeModal,
    handleSelectFile,
  } = useFileModal();

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      setFiles((prevFiles) => {
        const existingFileIds = new Set(prevFiles.map((file) => file._id));

        const filteredFiles = uploadedFiles.filter((file) => {
          const isAlreadyAdded = existingFileIds.has(file._id);
          if (isAlreadyAdded) return false;

          const matchesSearch =
            searchState.search === "" ||
            file.name.match(new RegExp(searchState.search, "i")) ||
            (file.description &&
              file.description.match(new RegExp(searchState.search, "i")));
          const matchesType =
            searchState.type === "" || file.type === searchState.type;

          return matchesSearch && matchesType;
        });

        return [...filteredFiles, ...prevFiles];
      });
    }
  }, [uploadedFiles, setFiles, searchState]);

  return (
    <FileContext.Provider
      value={{
        firebaseLoading,
        firebaseReady,
        checkFirebaseConfig,
        files,
        loading,
        syncing: uploading || syncing,
        hasMore,
        searchState,
        fetchFiles,
        syncFiles,
        clearFiles,
        uploading: uploading || syncing,
        uploadProgress,
        uploadedFiles,
        failedFiles,
        pendingFiles,
        addPendingFiles,
        removePendingFile,
        isModalOpen,
        modalZIndex,
        openModal,
        closeModal,
        deleteFile,
      }}
    >
      {children}

      {isModalOpen && (
        <FileSelectionModal
          isOpen={isModalOpen}
          fileType={fileType}
          zIndex={modalZIndex}
          onClose={closeModal}
          onSelectFile={handleSelectFile}
        />
      )}
    </FileContext.Provider>
  );
};
