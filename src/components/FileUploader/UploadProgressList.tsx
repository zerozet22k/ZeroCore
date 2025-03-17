"use client";

import React from "react";
import { List, Progress, Tooltip, Divider } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useFile } from "@/hooks/useFile";

export default function UploadProgressList() {
  const { pendingFiles, uploadProgress, uploadedFiles, failedFiles } =
    useFile();

  return (
    <>
      {pendingFiles.length > 0 && (
        <>
          <Divider orientation="left">Uploading Files</Divider>
          <List
            bordered
            dataSource={pendingFiles}
            renderItem={(item) => (
              <List.Item>
                <Tooltip title={item.file.name}>
                  <span>{item.file.name}</span>
                </Tooltip>
                <Progress
                  percent={uploadProgress[item.file.name] || 0}
                  style={{ width: "40%" }}
                />
              </List.Item>
            )}
          />
        </>
      )}

      {uploadedFiles.length > 0 && (
        <>
          <Divider orientation="left">Uploaded Files</Divider>
          <List
            bordered
            dataSource={uploadedFiles}
            renderItem={(item) => (
              <List.Item>
                <Tooltip title={item.name}>
                  <span>{item.name}</span>
                </Tooltip>
                <a
                  href={item.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CheckCircleOutlined style={{ color: "green" }} />
                </a>
              </List.Item>
            )}
          />
        </>
      )}

      {failedFiles.length > 0 && (
        <>
          <Divider orientation="left">Failed Files</Divider>
          <List
            bordered
            dataSource={failedFiles}
            renderItem={(item) => (
              <List.Item>
                <Tooltip title={item.file.name}>
                  <span>{item.file.name}</span>
                </Tooltip>
                <CloseCircleOutlined style={{ color: "red" }} />
              </List.Item>
            )}
          />
        </>
      )}
    </>
  );
}
