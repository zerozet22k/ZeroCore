import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition:
      transition || "background 0.2s, box-shadow 0.2s, transform 0.2s",
    marginBottom: "12px",
    cursor: "grab",
    background: isDragging ? "#e6f7ff" : "#ffffff",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: isDragging
      ? "0 4px 12px rgba(0, 0, 0, 0.2)"
      : "0 2px 6px rgba(0, 0, 0, 0.1)",
    border: isDragging ? "1px solid #1890ff" : "1px solid #d9d9d9",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export default SortableItem;
