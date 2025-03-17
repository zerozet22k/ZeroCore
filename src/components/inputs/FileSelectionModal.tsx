"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  Modal,
  List,
  Card,
  Spin,
  Input,
  Button,
  Empty,
  Typography,
} from "antd";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { useFile } from "@/hooks/useFile";
import debounce from "lodash/debounce";

import FileUploader from "@/components/FileUploader/FileUploader";
import { FileTypeWithEmpty } from "@/models/FileModel";

const { Text } = Typography;

const LazyImage = ({ src, alt }: { src: string; alt: string }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    style={{ height: 150, objectFit: "cover", borderRadius: "8px" }}
  />
);

type FileSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (fileUrl: string) => void;
  fileType?: FileTypeWithEmpty;
  zIndex?: number;
};

const FileSelectionModal = ({
  isOpen,
  onClose,
  onSelectFile,
  fileType = "",
  zIndex = 1000,
}: FileSelectionModalProps) => {
  const { files, loading, hasMore, fetchFiles, clearFiles, uploadedFiles } =
    useFile();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [localSearchState, setLocalSearchState] = useState({
    search: "",
    page: 1,
    type: fileType,
  });

  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);

  // Set local search state and fetch files on search or page change
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setLocalSearchState((prev) => ({
        ...prev,
        search: query,
        page: 1, // Reset page to 1 when search changes
      }));
    }, 300),
    []
  );

  useEffect(() => {
    if (isOpen) {
      clearFiles();
      setLocalSearchState((prev) => ({ ...prev, search: "", page: 1 }));
    }
  }, [isOpen, clearFiles]);

  // Call the fetch function only when the search state changes
  useEffect(() => {
    fetchFiles(localSearchState);
  }, [localSearchState, fetchFiles]);

  const handleScroll = useCallback(() => {
    const container = scrollableContainerRef.current;
    if (!container || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setLocalSearchState((prev) => {
        const nextPage = prev.page + 1;
        return { ...prev, page: nextPage };
      });
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const container = scrollableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <>
      <Modal
        title={`Select or Upload ${fileType || "File"}`}
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width="80%"
        zIndex={zIndex}
        styles={{
          body: {
            height: "75vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Upload Button */}
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => setIsUploadModalOpen(true)}
          style={{ marginBottom: "16px", borderRadius: "8px" }}
        >
          Upload File
        </Button>

        {/* Search Input */}
        <Input
          placeholder={`Search ${fileType || "files"}...`}
          value={localSearchState.search}
          onChange={(e) => {
            const newSearch = e.target.value;
            setLocalSearchState({ ...localSearchState, search: newSearch });
            debouncedSearch(newSearch);
          }}
          size="large"
          style={{ marginBottom: "16px", borderRadius: "8px" }}
        />

        {/* File List */}
        <div
          ref={scrollableContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          {files.length === 0 && !loading ? (
            <Empty description={`No ${fileType || "files"} found`} />
          ) : (
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={files}
              renderItem={(file) => (
                <List.Item key={file._id}>
                  <Card
                    hoverable
                    cover={<LazyImage src={file.publicUrl} alt={file.name} />}
                    onClick={() => onSelectFile(file.publicUrl)}
                  >
                    <Button
                      icon={<EyeOutlined />}
                      shape="circle"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.publicUrl, "_blank");
                      }}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        border: "none",
                      }}
                    />
                    {file.name}
                  </Card>
                </List.Item>
              )}
            />
          )}
          {loading && (
            <Spin
              size="large"
              style={{ display: "block", margin: "16px auto" }}
            />
          )}
        </div>
      </Modal>

      {/* Upload File Modal */}
      <Modal
        title="Upload New File"
        open={isUploadModalOpen}
        onCancel={() => setIsUploadModalOpen(false)}
        footer={null}
        width="60%"
        zIndex={zIndex + 10}
        styles={{
          body: {
            height: "auto",
            overflow: "hidden",
          },
        }}
      >
        <FileUploader />
      </Modal>
    </>
  );
};

export default FileSelectionModal;
