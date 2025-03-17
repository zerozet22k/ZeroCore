"use client";
import React, { CSSProperties } from "react";
import { Button, Input, Tooltip, Space, Typography } from "antd";
import { PictureOutlined, SyncOutlined } from "@ant-design/icons";
import { useFile } from "@/hooks/useFile";
import { FileType } from "@/models/FileModel";


interface ImageSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

const defaultWrapperStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "8px",
};

const defaultInputStyle: CSSProperties = {
  borderRadius: "4px",
  padding: "8px",
  width: "100%",
  border: "1px solid #ccc",
};

const ImageSelector: React.FC<ImageSelectorProps> = ({
  value = "",
  onChange,
  style = {},
}) => {
  const { openModal, syncFiles, loading } = useFile();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleOpenModal = () => {
    openModal((selectedFileUrl) => {
      onChange?.(selectedFileUrl);
    }, "image" as FileType);
  };

  return (
    <div style={{ ...defaultWrapperStyle, ...style }}>
      <Space.Compact style={{ width: "100%" }}>
        <Input
          value={value}
          placeholder="Image URL"
          style={{ ...defaultInputStyle }}
          onChange={handleInputChange}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Sync Images">
            <Button
              icon={<SyncOutlined />}
              onClick={syncFiles}
              loading={loading}
              style={{
                backgroundColor: "#1890ff",
                color: "#fff",
                border: "none",
                borderRadius: "0",
              }}
            />
          </Tooltip>

          {/* 🖼️ Open Image Picker Modal */}
          <Tooltip title="Choose Image">
            <Button
              icon={<PictureOutlined />}
              onClick={handleOpenModal}
              style={{
                backgroundColor: "#52c41a",
                color: "#fff",
                border: "none",
                borderRadius: "0 8px 8px 0",
              }}
            />
          </Tooltip>
        </div>
      </Space.Compact>
    </div>
  );
};

export default ImageSelector;
