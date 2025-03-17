"use client";
import React from "react";
import { Modal, Button } from "antd";
import {
  ModalBehaviorType,
  ChildNestedJsonField,
  ChildFieldInfo,
  ChildNestedArrayField,
} from "@/config/CMS/settings";
import CombinedField from "../CombinedField";

type JsonChildDesignRendererProps = {
  label?: string;
  itemKey: string;
  config: ChildNestedJsonField | ChildFieldInfo | ChildNestedArrayField;
  values: any;
  handleFieldChange: (key: string, fieldValue: any) => void;
  modalBehavior: { [key in ModalBehaviorType]?: boolean };
  childModalState: [
    string | null,
    React.Dispatch<React.SetStateAction<string | null>>
  ];
  zIndex?: number;
};

const JsonChildDesignRenderer: React.FC<JsonChildDesignRendererProps> = ({
  label,
  itemKey,
  config,
  values,
  handleFieldChange,
  modalBehavior,
  childModalState,
  zIndex = 1000,
}) => {
  const [activeItemKey, setActiveItemKey] = childModalState;
  const isModalOpen = activeItemKey === itemKey;

  const openItemModal = () => setActiveItemKey(itemKey);
  const closeItemModal = () => setActiveItemKey(null);

  if (modalBehavior[ModalBehaviorType.ITEM_MODAL]) {
    return (
      <>
        <Button
          type="default"
          onClick={openItemModal}
          style={{
            width: "100%",
            marginBottom: "12px",
            padding: "12px",
            border: "1px dashed #d9d9d9",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Edit {label}
        </Button>
        <Modal
          key={`modal-${itemKey}`}
          open={isModalOpen}
          onCancel={closeItemModal}
          footer={null}
          width="80%"
          zIndex={zIndex}
        >
          <CombinedField
            key={itemKey}
            keyPrefix={`${itemKey}`}
            config={config}
            values={values}
            onChange={(childKey, childValue) =>
              handleFieldChange(itemKey, childValue)
            }
            zIndex={zIndex + 1}
          />
        </Modal>
      </>
    );
  }

  return (
    <div
      style={{
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CombinedField
        key={itemKey}
        keyPrefix={`${itemKey}`}
        config={config}
        values={values}
        onChange={(childKey, childValue) =>
          handleFieldChange(itemKey, childValue)
        }
        zIndex={zIndex + 1}
      />
    </div>
  );
};

export default JsonChildDesignRenderer;
