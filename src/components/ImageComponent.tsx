"use client";

import React from "react";

interface ImageComponentProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: "cover" | "contain";
  style?: React.CSSProperties;
  priority?: boolean;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  alt,
  width = "100%",
  height = "auto",
  objectFit = "cover",
  style,
  priority = false,
}) => {
  if (!src) {
    console.error("Image source is invalid:", src);
    return <div>Invalid image source</div>;
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width,
        height,
        objectFit,
        ...style,
      }}
    />
  );
};

export default ImageComponent;
