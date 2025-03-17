"use client";
import React from "react";
import FieldParentCard from "./FieldDesigns/FieldParentCard";
import FieldDefaultCard from "./FieldDesigns/FieldDefaultCard";
import { FieldDesign } from "@/config/CMS/settings";
import FieldRow from "./FieldDesigns/FieldRow";

type FieldDesignRendererProps = {
  design: FieldDesign;
  label?: string; // Optional, but will be checked before rendering
  guide?: string;
  renderItem: () => React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
};

const FieldDesignRenderer: React.FC<FieldDesignRendererProps> = ({
  design,
  label,
  guide,
  renderItem,
  extra,
  style = {},
}) => {
  return renderDesign(design, label, guide, renderItem, extra, style);
};

const renderDesign = (
  design: FieldDesign,
  label?: string,
  guide?: string,
  renderItem?: () => React.ReactNode,
  extra?: React.ReactNode,
  style?: React.CSSProperties
) => {

  switch (design) {
    case FieldDesign.PARENT:
      return (
        <FieldParentCard
          label={label}
          guide={guide}
          extra={extra}
          style={style}
        >
          {renderItem?.()}
        </FieldParentCard>
      );

    case FieldDesign.CARD:
      return (
        <FieldDefaultCard
          label={label}
          guide={guide}
          extra={extra}
          style={style}
        >
          {renderItem?.()}
        </FieldDefaultCard>
      );

    case FieldDesign.NONE:
      return <>{renderItem?.()}</>;

    case FieldDesign.ROW:
    default:
      return (
        <FieldRow label={label} guide={guide} style={style}>
          {renderItem?.()}
        </FieldRow>
      );
  }
};

export default FieldDesignRenderer;
