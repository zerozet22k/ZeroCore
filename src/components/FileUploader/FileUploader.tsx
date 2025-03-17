"use client";

import React, { useState } from "react";
import {
  Upload,
  message,
  Card,
  Button,
  List,
  Input,
  Divider,
  UploadProps,
  Typography,
} from "antd";
import {
  InboxOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useFile } from "@/hooks/useFile";
import UploadProgressList from "./UploadProgressList";

const { Dragger } = Upload;
const { Text, Title } = Typography;

function splitNameAndExtension(filename: string) {
  const parts = filename.split(".");
  if (parts.length > 1) {
    const extension = parts.pop()!;
    const baseName = parts.join(".");
    return { baseName, extension };
  }
  return { baseName: filename, extension: "" };
}

export default function FileUploader() {
  const router = useRouter();
  const { firebaseLoading, firebaseReady, addPendingFiles, uploading } =
    useFile();

  const [localFiles, setLocalFiles] = useState<
    { file: File; name: string; extension: string }[]
  >([]);

  if (firebaseLoading) {
    return <div>Loading Firebase config...</div>;
  }
  if (!firebaseReady) {
    return (
      <div>
        <p>Firebase not configured. Please configure settings first:</p>
        <Button
          type="primary"
          onClick={() => router.push("/dashboard/settings")}
        >
          Go to Settings
        </Button>
      </div>
    );
  }

  const beforeUpload: UploadProps["beforeUpload"] = () => false;

  const handleChange: UploadProps["onChange"] = (info) => {
    setLocalFiles((prevLocalFiles) => {
      const newFiles = info.fileList
        .map((item) => item.originFileObj as File | undefined)
        .filter((file): file is File => Boolean(file))
        .filter(
          (file) =>
            !prevLocalFiles.some(
              (lf) => lf.file.name === file.name && lf.file.size === file.size
            )
        )
        .map((file) => {
          const { baseName, extension } = splitNameAndExtension(file.name);
          return { file, name: baseName, extension };
        });

      return [...prevLocalFiles, ...newFiles];
    });

    info.fileList.length = 0;
  };

  const removeLocalFile = (targetFile: File) => {
    setLocalFiles((prev) => prev.filter((lf) => lf.file !== targetFile));
  };

  const renameFile = (index: number, newName: string) => {
    setLocalFiles((prev) =>
      prev.map((fileObj, i) =>
        i === index
          ? { ...fileObj, name: newName.replace(/\.[^.]+$/, "") }
          : fileObj
      )
    );
  };

  const submitFiles = () => {
    if (localFiles.length === 0) {
      message.warning("No files selected!");
      return;
    }

    const finalFiles = localFiles.map(({ file, name, extension }) => {
      return new File([file], `${name}.${extension}`, { type: file.type });
    });

    setLocalFiles([]);
    addPendingFiles(finalFiles);
  };

  return (
    <>
      <Dragger
        multiple
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        customRequest={() => {}}
        style={{
          padding: 20,
          borderRadius: 8,
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: 40 }} />
        </p>
        <p className="ant-upload-text">
          Drag & drop files here, or click to select
        </p>
        <p className="ant-upload-hint">
          Rename or remove files before uploading.
        </p>
      </Dragger>

      {localFiles.length > 0 && (
        <>
          <Divider orientation="left">Staged Files</Divider>
          <List
            bordered
            dataSource={localFiles}
            renderItem={(item, index) => (
              <List.Item
                style={{
                  display: "flex",

                  padding: "10px 15px",
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{ display: "flex", flexGrow: 1, alignItems: "center" }}
                >
                  <Input
                    style={{ maxWidth: 200 }}
                    value={item.name}
                    onChange={(e) => renameFile(index, e.target.value)}
                  />
                  <Text type="secondary" style={{ marginLeft: "10px" }}>
                    .{item.extension}
                  </Text>
                </div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeLocalFile(item.file)}
                />
              </List.Item>
            )}
          />
        </>
      )}

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Button
          type="primary"
          icon={<CloudUploadOutlined />}
          onClick={submitFiles}
          disabled={uploading || localFiles.length === 0}
          loading={uploading}
          style={{ borderRadius: 6, padding: "6px 20px" }}
        >
          {uploading ? "Uploading..." : "Upload Now"}
        </Button>
      </div>

      <UploadProgressList />
    </>
  );
}
