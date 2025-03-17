"use client";
import React from "react";
import { Button, Typography, theme } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { darken, lighten } from "polished";

type ArrayChildTableDesignProps = {
  label: string;
  children: React.ReactNode;
  onRemove: (index: number) => void;
  index: number;
  style?: React.CSSProperties;
};

const ArrayChildTableDesign: React.FC<ArrayChildTableDesignProps> = ({
  label,
  children,
  onRemove,
  index,
  style = {},
}) => {
  const { token } = theme.useToken();

  return (
    <div style={{ ...style, position: "relative", paddingBottom: "12px" }}>
      {/* Table Label */}
      <Typography.Title level={5} style={{ marginBottom: "8px" }}>
        {label}
      </Typography.Title>

      {/* Table Wrapper */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: `1px solid ${token.colorBorder}`,
            backgroundColor: lighten(0.05, token.colorBgContainer),
          }}
        >
          <tbody>
            {React.Children.map(children, (child, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  borderBottom: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <td style={{ padding: "12px", width: "100%" }}>{child}</td>

                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    minWidth: "50px",
                  }}
                >
                  <Button
                    type="primary"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => onRemove(index)}
                    style={{
                      backgroundColor: darken(0.1, token.colorError),
                      borderColor: darken(0.15, token.colorError),
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArrayChildTableDesign;
