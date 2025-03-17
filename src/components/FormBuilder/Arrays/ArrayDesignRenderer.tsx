"use client";
import React from "react";
import { ArrayDesign, ModalBehaviorType } from "@/config/CMS/settings";
import FlatCard from "./ArrayDesigns/FlatCard";
import FlatOutsideCard from "./ArrayDesigns/FlatOutsideCard";
import ParentCard from "./ArrayDesigns/ParentCard";
import DefaultCard from "./ArrayDesigns/DefaultCard";
import { Modal, Button } from "antd";

type ArrayDesignRendererProps = {
  design: ArrayDesign;
  label: string;
  arrayValue: any[];
  onAdd: () => void;
  renderItem: (item: any, index: number) => React.ReactNode;
  style?: React.CSSProperties;
  modalBehavior: { [key in ModalBehaviorType]?: boolean };
  modalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  zIndex?: number;
};

const ArrayDesignRenderer: React.FC<ArrayDesignRendererProps> = ({
  design,
  label,
  arrayValue,
  onAdd,
  renderItem,
  style = {},
  modalBehavior,
  modalState,
  zIndex,
}) => {
  const [isModalOpen, setIsModalOpen] = modalState;

  if (modalBehavior[ModalBehaviorType.OPEN_IN_MODAL]) {
    return (
      <ParentCard
        label={label}
        onAdd={onAdd}
        showAddButton={true}
        style={style}
      >
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          style={{ width: "100%", marginBottom: "16px", padding: "12px" }}
        >
          Edit {label}
        </Button>

        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width="90%"
          zIndex={zIndex}
        >
          {renderDesign(arrayValue, design, label, onAdd, renderItem, style)}
        </Modal>
      </ParentCard>
    );
  }

  return renderDesign(arrayValue, design, label, onAdd, renderItem, style);
};

const renderDesign = (
  arrayValue: any[],
  design: ArrayDesign,
  label: string,
  onAdd: () => void,
  renderItem: (item: any, index: number) => React.ReactNode,
  style: React.CSSProperties
) => {
  switch (design) {
    case ArrayDesign.FLAT:
      return (
        <FlatCard
          label={label}
          onAdd={onAdd}
          showAddButton={true}
          style={style}
        >
          {arrayValue.map(renderItem)}
        </FlatCard>
      );

    case ArrayDesign.FLAT_OUTSIDE:
      return (
        <FlatOutsideCard
          label={label}
          onAdd={onAdd}
          showAddButton={true}
          style={style}
        >
          {arrayValue.map(renderItem)}
        </FlatOutsideCard>
      );

    case ArrayDesign.PARENT:
      return (
        <ParentCard
          label={label}
          onAdd={onAdd}
          showAddButton={true}
          style={style}
        >
          {arrayValue.map(renderItem)}
        </ParentCard>
      );

    case ArrayDesign.CARD:
    default:
      return (
        <DefaultCard
          label={label}
          onAdd={onAdd}
          showAddButton={true}
          style={style}
        >
          {arrayValue.map(renderItem)}
        </DefaultCard>
      );
  }
};

export default ArrayDesignRenderer;
