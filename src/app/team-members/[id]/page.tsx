"use client";
import React, { useEffect, useState } from "react";
import { Spin, Alert, Typography, theme } from "antd";
import { useParams } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import { UserAPI } from "@/models/UserModel";
import { rgba } from "polished";

const { Title, Paragraph } = Typography;
const { useToken } = theme;

const TeamMemberPage: React.FC = () => {
  const [user, setUser] = useState<UserAPI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const userId = params?.id as string;

  // Access the current theme tokens
  const { token } = useToken();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get<UserAPI>(`/team/${userId}`);
        if (response.data) {
          setUser(response.data);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
    );
  }

  if (error || !user) {
    return (
      <Alert
        message="Error"
        description={error || "User not found"}
        type="error"
        showIcon
        style={{ margin: "40px" }}
      />
    );
  }

  // Create a glass effect background using your theme's container color
  const glassBackground = rgba(token.colorBgContainer, 0.2);

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Subtle wave shape at the bottom, using theme text color */}
      <svg
        viewBox="0 0 1440 320"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "auto",
          zIndex: -1,
        }}
      >
        <path
          fill={token.colorTextBase}
          fillOpacity="0.03"
          d="M0,224L48,224C96,224,192,224,288,202.7C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,165.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* Centered Container */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          color: token.colorTextBase, // Let text adapt to theme
        }}
      >
        {/* Glassmorphism Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "90%",
            maxWidth: "1200px",
            borderRadius: "20px",
            overflow: "hidden",
            backgroundColor: glassBackground,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Portrait Section */}
          <div
            style={{
              flex: "1 1 40%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={user.cover_image || "/images/default-cover.jpg"}
              alt={`${user.name || user.username} portrait`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </div>

          {/* Details Section */}
          <div
            style={{
              flex: "1 1 60%",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Title
              level={2}
              style={{ marginBottom: "0.5em", color: token.colorTextHeading }}
            >
              {user.name || user.username}
            </Title>
            {user.position && (
              <Title
                level={4}
                style={{ marginBottom: "1em", color: token.colorTextDescription }}
              >
                {user.position}
              </Title>
            )}
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "1.5em" }}>
              {user.bio || "No biography available."}
            </Paragraph>
            <Paragraph style={{ fontSize: "16px" }}>
              <strong>Email:</strong> {user.email}
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberPage;
