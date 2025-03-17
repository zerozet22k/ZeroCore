"use client";
import React, { CSSProperties, useState, useEffect } from "react";
import { theme } from "antd";
import { v4 as uuidv4 } from "uuid";
import CombinedField from "../CombinedField";
import {
  ArrayDesign,
  ChildArrayDesign,
  ChildNestedArrayField,
  ModalBehaviorType,
  NestedArrayField,
} from "@/config/CMS/settings";
import ArrayDesignRenderer from "./ArrayDesignRenderer";
import ArrayChildDesignRenderer from "./ArrayChildDesignRenderer";

type ArrayFieldRendererProps = {
  config: NestedArrayField | ChildNestedArrayField;
  value?: any[];
  onChange: (value: any[]) => void;
  style?: CSSProperties;
  zIndex?: number;
};

const ArrayFieldRenderer: React.FC<ArrayFieldRendererProps> = ({
  config,
  value = [],
  onChange,
  style = {},
  zIndex = 1000,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  // If parent's value is not an array (e.g. empty string), update it to []
  useEffect(() => {
    if (!Array.isArray(value)) {
      onChange([]);
    }
  }, [value, onChange]);

  const arrayValue = Array.isArray(value) ? value : [];

  const modalBehavior = config.modalBehavior || {
    [ModalBehaviorType.OPEN_IN_MODAL]: false,
    [ModalBehaviorType.ITEM_MODAL]: false,
  };

  const design: ArrayDesign = config.arrayDesign || ArrayDesign.CARD;
  const childDesign: ChildArrayDesign =
    config.childArrayDesign || ChildArrayDesign.CARD;

  const handleAddArrayItem = () => {
    const newItem = {
      id: uuidv4(),
      ...Object.keys(config.fields || {}).reduce(
        (acc: Record<string, any>, key: string) => {
          acc[key] = "";
          return acc;
        },
        {}
      ),
    };
    onChange([...arrayValue, newItem]);
  };

  const handleRemoveArrayItem = (index: number) => {
    onChange(arrayValue.filter((_, i) => i !== index));
  };

  const getItemTitle = (index: number) =>
    config.keyLabel ? `${config.keyLabel} ${index + 1}` : `Item ${index + 1}`;

  const renderItem = (item: any, index: number) => {
    const uniqueKey = item.id || index;

    const content = (
      <>
        {Object.entries(config.fields).map(([fieldKey, fieldConfig]) => (
          <CombinedField
            key={`${uniqueKey}-${fieldKey}`}
            keyPrefix={`${uniqueKey}.${fieldKey}`}
            config={fieldConfig}
            values={item[fieldKey] || ""}
            onChange={(childKey, childValue) => {
              const updatedArray = [...arrayValue];
              updatedArray[index] = {
                ...updatedArray[index],
                [fieldKey]: childValue,
              };
              onChange(updatedArray);
            }}
            zIndex={zIndex + 1}
          />
        ))}
      </>
    );

    return (
      <ArrayChildDesignRenderer
        childDesign={childDesign}
        key={uniqueKey}
        label={getItemTitle(index)}
        item={item}
        index={index}
        renderItemContent={content}
        onRemove={handleRemoveArrayItem}
        modalBehavior={modalBehavior}
        childModalState={[activeItemIndex, setActiveItemIndex]}
        zIndex={zIndex}
      />
    );
  };

  return (
    <ArrayDesignRenderer
      design={design}
      label={config.label || ""}
      arrayValue={arrayValue}
      onAdd={handleAddArrayItem}
      renderItem={renderItem}
      style={style}
      modalBehavior={modalBehavior}
      modalState={[isModalOpen, setIsModalOpen]}
      zIndex={zIndex}
    />
  );
};

export default ArrayFieldRenderer;
