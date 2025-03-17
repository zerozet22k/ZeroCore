"use client";
import React from "react";
import { Modal, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { ChildArrayDesign, ModalBehaviorType } from "@/config/CMS/settings";
import ArrayChildListDesign from "./ArrayChildDesigns/ArrayChildListDesign";
import ArrayChildCardDesign from "./ArrayChildDesigns/ArrayChildCardDesign";
import ArrayChildTableDesign from "./ArrayChildDesigns/ArrayChildTableDesign";
import ArrayChildNoneDesign from "./ArrayChildDesigns/ArrayChildNoneDesign";

type ArrayChildDesignRendererProps = {
  childDesign?: ChildArrayDesign;
  label: string;
  item: any;
  index: number;
  renderItemContent: React.ReactNode;
  onRemove: (index: number) => void;
  modalBehavior: { [key in ModalBehaviorType]?: boolean };
  childModalState: [
    number | null,
    React.Dispatch<React.SetStateAction<number | null>>
  ];
  zIndex?: number;
};

const ArrayChildDesignRenderer: React.FC<ArrayChildDesignRendererProps> = ({
  childDesign = ChildArrayDesign.LIST,
  label,
  item,
  index,
  renderItemContent,
  onRemove,
  modalBehavior,
  childModalState,
  zIndex = 1000,
}) => {
  const [activeItemIndex, setActiveItemIndex] = childModalState;
  const openItemModal = () => setActiveItemIndex(index);
  const closeItemModal = () => setActiveItemIndex(null);

  if (modalBehavior[ModalBehaviorType.ITEM_MODAL]) {
    return (
      <>
        <Button
          type="default"
          onClick={openItemModal}
          style={{
            width: "100%",
            marginBottom: "12px",
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
            padding: "12px",
            border: "1px dashed #d9d9d9",
            borderRadius: "8px",
          }}
        >
          {label}
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            style={{ color: "red" }}
          />
        </Button>

        <Modal
          key={`modal-${index}`}
          title={label}
          open={activeItemIndex === index}
          onCancel={closeItemModal}
          footer={null}
          width="80%"
          zIndex={zIndex}
        >
          {renderItemContent}
        </Modal>
      </>
    );
  }

  switch (childDesign) {
    case ChildArrayDesign.CARD:
      return (
        <ArrayChildCardDesign label={label} onRemove={onRemove} index={index}>
          {renderItemContent}
        </ArrayChildCardDesign>
      );

    case ChildArrayDesign.TABLE:
      return (
        <ArrayChildTableDesign label={label} onRemove={onRemove} index={index}>
          {renderItemContent}
        </ArrayChildTableDesign>
      );

    case ChildArrayDesign.NONE:
      return (
        <ArrayChildNoneDesign onRemove={onRemove} index={index}>
          {renderItemContent}
        </ArrayChildNoneDesign>
      );

    case ChildArrayDesign.LIST:
    default:
      return (
        <ArrayChildListDesign label={label} onRemove={onRemove} index={index}>
          {renderItemContent}
        </ArrayChildListDesign>
      );
  }
};

export default ArrayChildDesignRenderer;
