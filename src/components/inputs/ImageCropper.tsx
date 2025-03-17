import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import ReactCrop, { Crop, makeAspectCrop, centerCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  imageUrl: string;
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
  aspectRatio?: number; // e.g. 3/4 = 0.75 for portrait
}

/**
 * Compute the largest centered crop (in displayed px) that fits within
 * the displayedWidth × displayedHeight and respects 'aspectRatio'.
 */
function getInitialCrop(
  displayedWidth: number,
  displayedHeight: number,
  ratio: number
): Crop {
  let newWidth: number;
  let newHeight: number;

  // If the aspect ratio is more "portrait" than the displayed image ratio,
  // fill the full displayed height. Otherwise, fill the full displayed width.
  if (ratio < displayedWidth / displayedHeight) {
    // Fill full displayed height
    newHeight = displayedHeight;
    newWidth = newHeight * ratio;
    // If it goes wider than the displayed width, clamp it
    if (newWidth > displayedWidth) {
      newWidth = displayedWidth;
      newHeight = newWidth / ratio;
    }
  } else {
    // Fill full displayed width
    newWidth = displayedWidth;
    newHeight = newWidth / ratio;
    // If it goes taller than displayed height, clamp it
    if (newHeight > displayedHeight) {
      newHeight = displayedHeight;
      newWidth = newHeight * ratio;
    }
  }

  // Center it
  const crop = centerCrop(
    makeAspectCrop(
      {
        unit: "px",
        width: newWidth,
        height: newHeight,
      },
      ratio,
      displayedWidth,
      displayedHeight
    ),
    displayedWidth,
    displayedHeight
  );

  return crop;
}

const ImageCropper = forwardRef(
  ({ imageUrl, imageRef, aspectRatio }: ImageCropperProps, ref) => {
    // Extend Crop with optional 'aspect' property for TS
    const [crop, setCrop] = useState<Crop & { aspect?: number }>({
      unit: "px",
      width: 100,
      height: 100,
      x: 50,
      y: 50,
      aspect: aspectRatio,
    });

    // Track the displayed size (onscreen) of the image
    const [displayedSize, setDisplayedSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement | null>(null);

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget as HTMLImageElement;

      // The actual rendered size (in px) of the <img> element in the DOM
      const displayedWidth = img.offsetWidth;
      const displayedHeight = img.offsetHeight;

      setDisplayedSize({ width: displayedWidth, height: displayedHeight });

      // If no aspectRatio is passed, default to the displayed ratio
      const ratio = aspectRatio || displayedWidth / displayedHeight;

      // Create a crop that fits inside the displayed image
      const newCrop = getInitialCrop(displayedWidth, displayedHeight, ratio);

      // Also store ratio in the crop state if you want it locked
      setCrop({ ...newCrop, aspect: ratio });
    };

    const handleCropChange = (newCrop: Crop) => {
      // Constrain x and y so the crop box never goes outside the displayed image
      setCrop((prev) => ({
        ...prev,
        x: Math.min(
          Math.max(newCrop.x, 0),
          displayedSize.width - newCrop.width
        ),
        y: Math.min(
          Math.max(newCrop.y, 0),
          displayedSize.height - newCrop.height
        ),
        width: newCrop.width,
        height: newCrop.height,
      }));
    };

    // Expose a function for the parent to retrieve the cropped image
    useImperativeHandle(ref, () => ({
      getCroppedImg: async () => {
        if (!imageRef.current) return null;

        const image = imageRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        // Scale factor from displayed size to the image's natural size
        const scaleX = image.naturalWidth / displayedSize.width;
        const scaleY = image.naturalHeight / displayedSize.height;

        // Draw the correct portion of the full-res image onto the canvas
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        try {
          return canvas.toDataURL("image/png");
        } catch (error) {
          console.error("Error exporting cropped image:", error);
          return null;
        }
      },
    }));

    return (
      <div style={{ textAlign: "center" }} ref={containerRef}>
        <ReactCrop
          crop={crop}
          onChange={handleCropChange}
          keepSelection
          minWidth={50}
          minHeight={50}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Crop Preview"
            crossOrigin="anonymous"
            onLoad={onImageLoad}
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              cursor: "grab",
            }}
          />
        </ReactCrop>
      </div>
    );
  }
);

ImageCropper.displayName = "ImageCropper";

export default ImageCropper;
