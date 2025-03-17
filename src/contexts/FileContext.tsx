"use client";

import { createContext } from "react";
import { FileDataAPI, FileType, FileTypeWithEmpty } from "@/models/FileModel";

/** Represents a successfully uploaded file */
export interface UploadedFile {
  name: string;
  url: string;
}

/** Represents search state for fetching files */
export type SearchState = {
  search: string;
  page: number;
  type: FileTypeWithEmpty;
};

/** Represents a pending file waiting to be uploaded */
export type PendingItem = {
  file: File;
};

/** Represents a file that failed to upload */
export type FailedFile = {
  file: File;
  error: string;
};

type FileContextProps = {
  /** Firebase readiness checks */
  firebaseLoading: boolean;
  firebaseReady: boolean;
  checkFirebaseConfig: () => Promise<void>;

  /** File listing logic */
  files: FileDataAPI[];
  loading: boolean;
  syncing: boolean;
  hasMore: boolean;
  searchState: SearchState;
  fetchFiles: (searchStateData: SearchState) => void;
  syncFiles: () => void;
  clearFiles: () => void;
  deleteFile: (fileIds: string[]) => Promise<void>;
  uploading: boolean;
  uploadProgress: Record<string, number>;
  uploadedFiles: FileDataAPI[];
  failedFiles: FailedFile[];
  pendingFiles: PendingItem[];
  addPendingFiles: (files: File[]) => void;
  removePendingFile: (file: File) => void;

  isModalOpen: boolean;
  modalZIndex: number;
  openModal: (
    onSelectFile: (fileUrl: string) => void,
    fileType: FileType,
    zIndex?: number
  ) => void;
  closeModal: () => void;
};

export const FileContext = createContext<FileContextProps | null>(null);
