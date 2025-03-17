"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  List,
  Card,
  Spin,
  Button,
  Popconfirm,
  Input,
  Tooltip,
  Select,
  Typography,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SyncOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useFile } from "@/hooks/useFile";
import debounce from "lodash/debounce";
import FileThumbnail from "@/components/FileThumbnail";
import {
  FileType,
  STORAGE_SERVICES,
  FileTypeWithEmpty,
} from "@/models/FileModel";
import { SearchState } from "@/contexts/FileContext";
const { Text } = Typography;

const ALLOW_LOCAL_DELETE = false;

const fileTypeOptions = [
  { value: "", label: "All" },
  { value: FileType.IMAGE, label: "Image" },
  { value: FileType.VIDEO, label: "Video" },
  { value: FileType.AUDIO, label: "Audio" },
  { value: FileType.DOCUMENT, label: "Document" },
  { value: FileType.ARCHIVE, label: "Archive" },
  { value: FileType.CODE, label: "Code" },
  { value: FileType.SPREADSHEET, label: "Spreadsheet" },
  { value: FileType.PRESENTATION, label: "Presentation" },
  { value: FileType.UNKNOWN, label: "Unknown" },
];

const FileListPage: React.FC = () => {
  const {
    files,
    loading,
    syncing,
    hasMore,
    fetchFiles,
    syncFiles,
    deleteFile,
    searchState,
  } = useFile();

  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const observerRef = useRef<HTMLDivElement | null>(null);

  const disableIndividualDelete = selectedFiles.size > 0;

  const [localSearchState, setLocalSearchState] =
    useState<SearchState>(searchState);

  const debouncedFetchFiles = useCallback(
    debounce(() => {
      fetchFiles(localSearchState);
    }, 300),
    [localSearchState]
  );

  useEffect(() => {
    debouncedFetchFiles();
  }, [localSearchState, debouncedFetchFiles]);

  const fetchMoreOnIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !loading) {
        setLocalSearchState((prev) => {
          const nextPage = prev.page + 1;
          return { ...prev, page: nextPage };
        });
      }
    },
    [hasMore, loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(fetchMoreOnIntersect, {
      rootMargin: "100px",
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchMoreOnIntersect]);

  useEffect(() => {
    fetchFiles(localSearchState);
  }, [localSearchState, fetchFiles]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;

    setLocalSearchState((prev) => ({
      ...prev,
      search: newSearch,
      page: 1,
    }));

    if (newSearch === "") {
      fetchFiles({ ...localSearchState, search: "", page: 1 });
    }
  };

  const toggleFileSelection = (fileId: string, fileService: string) => {
    if (fileService === STORAGE_SERVICES.LOCAL && !ALLOW_LOCAL_DELETE) {
      return;
    }
    setSelectedFiles((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(fileId)) {
        newSelection.delete(fileId);
      } else {
        newSelection.add(fileId);
      }
      return newSelection;
    });
  };

  const handleDeleteFiles = async () => {
    await deleteFile(Array.from(selectedFiles));
    setSelectedFiles(new Set());
  };

  const openFile = (url: string | undefined) => {
    window.open(url, "_blank");
  };

  const renderFileCard = (file: any) => {
    const isSelected = selectedFiles.has(file._id);
    const selectionOrder = isSelected
      ? Array.from(selectedFiles).indexOf(file._id) + 1
      : null;

    return (
      <List.Item key={file._id}>
        <Card
          hoverable
          onClick={() => toggleFileSelection(file._id, file.service)}
          style={{
            position: "relative",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            border: isSelected ? "2px solid #1890ff" : undefined,
            opacity: isSelected ? 0.8 : 1,
          }}
          cover={<FileThumbnail file={file} />}
          actions={[
            <Tooltip title="View File" key="view">
              <Button
                icon={<EyeOutlined />}
                shape="circle"
                onClick={(e) => {
                  e.stopPropagation();
                  openFile(file.publicUrl);
                }}
              />
            </Tooltip>,

            (ALLOW_LOCAL_DELETE || file.service !== STORAGE_SERVICES.LOCAL) &&
              !disableIndividualDelete && (
                <Popconfirm
                  title="Are you sure you want to delete this file?"
                  onConfirm={() => deleteFile([file._id])}
                  okText="Yes"
                  cancelText="No"
                  key="delete"
                >
                  <Tooltip title="Delete File">
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      shape="circle"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Tooltip>
                </Popconfirm>
              ),
          ]}
        >
          <Card.Meta title={file.name} description={file.service} />
          {isSelected && (
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "#1890ff",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                zIndex: 1,
              }}
            >
              {selectionOrder}
            </div>
          )}
        </Card>
      </List.Item>
    );
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <Input
          placeholder="Search files..."
          value={localSearchState.search}
          onChange={handleSearchChange}
          size="large"
          style={{ flex: 1, height: 40 }}
        />
        <Select
          value={localSearchState.type}
          style={{ width: 150, height: 40 }}
          onChange={(value) => {
            setLocalSearchState({
              ...localSearchState,
              type: value as FileTypeWithEmpty,
              page: 1,
            });
          }}
          options={fileTypeOptions}
        />
        <Tooltip title="Sync Files">
          <Button
            icon={<SyncOutlined spin={syncing} />}
            onClick={syncFiles}
            loading={syncing}
            size="large"
            style={{ height: 40 }}
          />
        </Tooltip>
        {selectedFiles.size > 0 && (
          <Popconfirm
            title={`Delete ${selectedFiles.size} files?`}
            onConfirm={handleDeleteFiles}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="large"
              style={{ height: 40 }}
            >
              Delete Selected
            </Button>
          </Popconfirm>
        )}
      </div>

      {/* File List */}
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={files}
        renderItem={renderFileCard}
        locale={{ emptyText: "No files found" }}
      />

      {/* Observer div for infinite scrolling */}
      <div ref={observerRef} style={{ textAlign: "center", marginTop: "20px" }}>
        {loading && <Spin size="large" style={{ margin: "20px 0" }} />}
        {!hasMore && !loading && (
          <div>
            <Text type="secondary">No More Items</Text>
          </div>
        )}
        {hasMore && !loading && (
          <div>
            <Button
              type="link"
              icon={<DownOutlined />}
              onClick={() => {
                setLocalSearchState((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }));
                fetchFiles(localSearchState);
              }}
              style={{ marginTop: 12 }}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileListPage;
