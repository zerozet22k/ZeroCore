"use client";
import React, { CSSProperties } from "react";
import { Button, Input, Tooltip, Space } from "antd";
import { PictureOutlined, SyncOutlined } from "@ant-design/icons";
import { useFile } from "@/hooks/useFile";

import {
  defaultInputStyle,
  defaultWrapperStyle,
  defaultSyncButtonStyle,
  defaultChooseImageButtonStyle,
} from "../../InputStyle";
import { FileType } from "@/models/FileModel";

interface ImageSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
  zIndex?: number;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  value = "",
  onChange,
  style = {},
  zIndex = 1000,
}) => {
  const { openModal, syncFiles, loading } = useFile();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleOpenModal = () => {
    openModal(
      (selectedFileUrl) => {
        onChange?.(selectedFileUrl);
      },
      "image" as FileType,
      zIndex + 1
    );
  };

  return (
    <div style={{ ...defaultWrapperStyle, ...style }}>
      <Space.Compact style={{ width: "100%" }}>
        <Input
          value={value}
          placeholder="Image URL"
          onChange={handleInputChange}
          style={{ ...defaultInputStyle }}
        />
        <Tooltip title="Sync Images">
          <Button
            icon={<SyncOutlined />}
            onClick={syncFiles}
            loading={loading}
            style={{ ...defaultSyncButtonStyle }}
          />
        </Tooltip>
        <Tooltip title="Choose Image">
          <Button
            icon={<PictureOutlined />}
            onClick={handleOpenModal}
            style={{ ...defaultChooseImageButtonStyle }}
          />
        </Tooltip>
      </Space.Compact>
    </div>
  );
};

export default ImageSelector;
