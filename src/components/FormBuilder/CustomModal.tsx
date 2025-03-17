"use client";
import React from "react";
import { Modal } from "antd";

type CustomModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string | number;
  zIndex?: number;
  footer?: React.ReactNode | null;
};

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  width = "80%",
  zIndex = 1000,
  footer = null,
}) => {
  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      footer={footer}
      width={width}
      zIndex={zIndex}
      destroyOnClose
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
