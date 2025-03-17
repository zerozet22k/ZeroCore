"use client";
import React from "react";
import { Row, Col } from "antd";
import FieldTitle from "../extra/FieldTitle";

type FieldRowProps = {
  label?: string;
  guide?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const FieldRow: React.FC<FieldRowProps> = ({
  label,
  guide,
  children,
  style = {},
}) => {
  return (
    <div
      style={{
        padding: "10px",
        marginBottom: "10px",
        ...style,
      }}
    >
      <FieldTitle label={label} guide={guide} level={5} />
      <Row gutter={[12, 12]}>
        <Col span={24}>{children}</Col>
      </Row>
    </div>
  );
};

export default FieldRow;
