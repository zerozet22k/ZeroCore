import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import { useLayout } from "@/hooks/useLayout";
import LanguageSelector from "@/components/LanguageSelector";

const { Text } = Typography;

const OverlayBar: React.FC<{
  overlayInfo: { openingHours: string; phoneNumber: string; email: string };
}> = ({ overlayInfo }) => {
  const { isMobile } = useLayout();

  const backgroundColor = "#000";
  const textColor = "#fff";

  const items = [
    `🕒 ${overlayInfo.openingHours}`,
    `📞 ${overlayInfo.phoneNumber}`,
    `✉️ ${overlayInfo.email}`,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % items.length);
          setFade(true);
        }, 500);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isMobile, items.length]);

  if (isMobile) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          background: backgroundColor,
          color: textColor,
          textAlign: "center",
          padding: "8px 10px",
          fontSize: "14px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "opacity 0.5s ease-in-out",
          zIndex: 999,
        }}
      >
        <Text style={{ opacity: fade ? 1 : 0, color: textColor }}>
          {items[currentIndex]}
        </Text>
        <div
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <LanguageSelector />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        background: backgroundColor,
        color: textColor,
        textAlign: "center",
        padding: "5px 20px",
        fontSize: "14px",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        transition: "transform 0.3s ease-in-out",
        zIndex: 999,
        height: "fit-content",
      }}
    >
      <Text style={{ color: textColor }}>{items[0]}</Text>
      <Text style={{ color: textColor }}>{items[1]}</Text>
      <Text style={{ color: textColor }}>{items[2]}</Text>
      <LanguageSelector />
    </div>
  );
};

export default OverlayBar;
