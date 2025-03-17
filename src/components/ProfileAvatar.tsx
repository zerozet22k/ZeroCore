import React, { useState, useRef } from "react";
import { message, Button, Modal, Avatar, Spin } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import ImageCropper from "./inputs/ImageCropper";
import apiClient from "@/utils/api/apiClient";
import { UserAPI } from "@/models/UserModel";

interface ProfileAvatarProps {
  user?: UserAPI;
  onAvatarChange?: (avatarUrl: string) => void;
  onCoverChange?: (coverUrl: string) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  user,
  onAvatarChange,
  onCoverChange,
}) => {
  const defaultAvatar = "/images/default-avatar.webp";
  const defaultCover = "/images/default-cover.jpg";

  const [avatarUrl, setAvatarUrl] = useState<string>(
    user?.avatar || defaultAvatar
  );
  const [coverUrl, setCoverUrl] = useState<string>(
    user?.cover_image || defaultCover
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<"avatar" | "cover">(
    "avatar"
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropRef = useRef<any>(null);

  /** Handle file selection */
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
  ) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      e.target.value = "";

      setUploadingFor(type);
      setModalVisible(true);
    }
  };

  /** Save the cropped image */
  const handleSaveCroppedImage = async () => {
    if (cropRef.current && imageRef.current) {
      try {
        const croppedImage = await cropRef.current.getCroppedImg();
        if (!croppedImage) {
          message.error("Please crop the image before saving.");
          return;
        }
        await uploadToServer(croppedImage, uploadingFor);
      } catch (error) {
        console.error(error);
        message.error("Failed to process cropped image.");
      }
    }
  };

  /** Upload image via signed URL */
  const uploadToServer = async (
    imageDataUrl: string,
    type: "avatar" | "cover"
  ) => {
    setUploading(true);
    const contentType = imageDataUrl.startsWith("data:image/png")
      ? "image/png"
      : "image/jpeg";

    try {
      const response = await apiClient.post(
        `/users/${user?._id}/getSignedUrl?type=${type}`,
        { contentType }
      );
      if (response.status !== 200) throw new Error("Upload URL fetch failed");
      const uploadUrl = response.data.uploadUrl;

      const base64Data = imageDataUrl.split(",")[1];
      const imageBlob = new Blob(
        [
          new Uint8Array(
            atob(base64Data)
              .split("")
              .map((c) => c.charCodeAt(0))
          ),
        ],
        { type: contentType }
      );

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: imageBlob,
        headers: { "Content-Type": contentType },
      });
      if (!uploadResponse.ok) throw new Error("Upload failed");

      const publicUrl = uploadUrl.split("?")[0];
      await updateUserImage(publicUrl, type);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error("Upload error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /** Update user in DB */
  const updateUserImage = async (
    newImageUrl: string,
    type: "avatar" | "cover"
  ) => {
    try {
      const fieldKey = type === "avatar" ? "avatar" : "cover_image";
      await apiClient.put(`/users/${user?._id}`, { [fieldKey]: newImageUrl });
      if (type === "avatar") {
        setAvatarUrl(newImageUrl);
        onAvatarChange?.(newImageUrl);
      } else {
        setCoverUrl(newImageUrl);
        onCoverChange?.(newImageUrl);
      }
      message.success(`Updated ${type} successfully!`);
    } catch (error) {
      console.error(error);
      message.error(`Failed to update ${type}.`);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "400px",
        borderRadius: "8px",
        backgroundColor: "#f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        marginBottom: "60px",
      }}
    >
      {/* Cover Image */}
      <img
        src={coverUrl}
        alt="Cover"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Cover Camera Icon */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: "50%",
          padding: "8px",
          cursor: "pointer",
        }}
        onClick={() => {
          setUploadingFor("cover");
          fileInputRef.current?.click();
        }}
      >
        <CameraOutlined style={{ color: "#fff", fontSize: "18px" }} />
      </div>

      {/* Avatar Overlapping the Cover by Half */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          transform: "translate(-50%, 50%)",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          border: "4px solid white",
          overflow: "hidden",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          cursor: "pointer",
        }}
        onClick={() => {
          setUploadingFor("avatar");
          fileInputRef.current?.click();
        }}
      >
        <Avatar
          src={avatarUrl}
          size={120}
          style={{ width: "100%", height: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            background: "rgba(0,0,0,0.5)",
            textAlign: "center",
            padding: "4px 0",
          }}
        >
          <CameraOutlined style={{ color: "#fff", fontSize: "16px" }} />
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/png, image/jpeg"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e, uploadingFor)}
      />

      {/* Cropping Modal */}
      <Modal
        open={modalVisible}
        title={`Crop Your ${
          uploadingFor === "avatar" ? "Avatar" : "Cover (Portrait)"
        }`}
        onCancel={() => setModalVisible(false)}
        width="90vw"
        style={{ top: 20 }}
        styles={{
          body: {
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
          },
        }}
        maskClosable={false}
        footer={[
          <Button
            key="cancel"
            onClick={() => setModalVisible(false)}
            disabled={uploading}
          >
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleSaveCroppedImage}
            disabled={uploading}
          >
            Save
          </Button>,
        ]}
      >
        {uploading && (
          <Spin size="large" style={{ position: "absolute", zIndex: 1 }} />
        )}
        {previewUrl && (
          <ImageCropper
            ref={cropRef}
            imageUrl={previewUrl}
            imageRef={imageRef}
            aspectRatio={uploadingFor === "avatar" ? 1 : 3 / 4}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProfileAvatar;
