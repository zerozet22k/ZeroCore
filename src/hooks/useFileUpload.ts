import { useState, useCallback, useRef, useEffect } from "react";
import apiClient from "@/utils/api/apiClient";
import { message } from "antd";
import { UploadedFile, FailedFile, PendingItem } from "@/contexts/FileContext";
import { shortenFileName } from "@/utils/filesUtil";
import { FileDataAPI } from "@/models/FileModel";

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [uploadedFiles, setUploadedFiles] = useState<FileDataAPI[]>([]);
  const [failedFiles, setFailedFiles] = useState<FailedFile[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingItem[]>([]);

  const uploadQueueRef = useRef<File[]>([]);

  const addPendingFiles = (newFiles: File[]): Promise<void> => {
    return new Promise((resolve) => {
      setPendingFiles((prev) => {
        const newPending = [...prev];

        for (const f of newFiles) {
          const alreadyExists = newPending.some(
            (p) => p.file.name === f.name && p.file.size === f.size
          );
          if (!alreadyExists) {
            newPending.push({ file: f });
          }
        }
        return newPending;
      });
      setTimeout(resolve, 10);
    });
  };

  const removePendingFile = useCallback((file: File) => {
    setPendingFiles((prev) => prev.filter((item) => item.file !== file));
  }, []);

  const processQueue = useCallback(async () => {
    if (pendingFiles.length === 0) return;

    setUploading(true);
    setUploadProgress({});
    setUploadedFiles([]);
    setFailedFiles([]);

    let successCount = 0;
    let failCount = 0;
    const total = pendingFiles.length;

    const totalSize = pendingFiles.reduce(
      (sum, { file }) => sum + file.size,
      0
    );
    let totalUploaded = 0;

    for (const { file } of pendingFiles) {
      uploadQueueRef.current.push(file);

      const shortName = shortenFileName(file.name);

      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

      let lastLoaded = 0;

      message.open({
        key: "upload-progress",
        type: "loading",
        content: `Uploading ${shortName}... (0%) - Success: ${successCount}, Fail: ${failCount}`,
        duration: 0,
      });

      try {
        const signedUrlResponse = await apiClient.post("/files/signedUrl", {
          fileName: file.name,
          contentType: file.type,
        });

        if (
          !signedUrlResponse.data?.uploadUrl ||
          !signedUrlResponse.data?.filePath
        ) {
          throw new Error("Failed to get signed URL.");
        }

        const { uploadUrl } = signedUrlResponse.data;

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl, true);
          xhr.setRequestHeader("Content-Type", file.type);

          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              const newlyUploadedBytes = evt.loaded - lastLoaded;
              lastLoaded = evt.loaded;

              totalUploaded += newlyUploadedBytes;

              const filePercent = Math.round((evt.loaded / evt.total) * 100);
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: filePercent,
              }));

              const totalPercent = Math.round(
                (totalUploaded / totalSize) * 100
              );

              message.open({
                key: "upload-progress",
                type: "loading",
                content: `Uploading ${shortName}... (${filePercent}%) — Overall: ${totalPercent}% (Success: ${successCount}, Fail: ${failCount})`,
                duration: 0,
              });
            }
          };

          xhr.onload = async () => {
            if (xhr.status === 200) {
              const response = await apiClient.post("/files", {
                file: {
                  rawFilePath: signedUrlResponse.data.filePath,
                  name: file.name,
                  size: file.size,
                },
              });

              if (response.data.savedFile) {
                setUploadedFiles((prev) => [...prev, response.data.savedFile]);
                successCount++;
                resolve();
              } else {
                reject(new Error("File metadata could not be saved"));
              }
            } else {
              reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
          };

          xhr.onerror = () =>
            reject(new Error("Upload failed (network error)"));
          xhr.send(file);
        });
      } catch (err: any) {
        failCount++;
        setFailedFiles((prev) => [
          ...prev,
          { file, error: err?.message || "Unknown Error" },
        ]);
      } finally {
        uploadQueueRef.current = uploadQueueRef.current.filter(
          (f) => f !== file
        );
        setPendingFiles((prev) => prev.filter((p) => p.file !== file));
      }
    }

    message.success({
      key: "upload-progress",
      content: `Upload Complete! (Success: ${successCount}, Fail: ${failCount})`,
    });

    setUploading(false);
  }, [pendingFiles]);

  useEffect(() => {
    if (!uploading && pendingFiles.length > 0) {
      void processQueue();
    }
  }, [pendingFiles, uploading, processQueue]);

  return {
    uploading,
    uploadProgress,
    uploadedFiles,
    failedFiles,
    pendingFiles,
    addPendingFiles,
    removePendingFile,
    processQueue,
  };
};
