"use client";

import React, { useState } from "react";
import { Layout, Drawer, Space, Typography, theme, Button } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import { GLOBAL_SETTINGS_KEYS } from "@/config/CMS/settings/keys/GLOBAL_SETTINGS_KEYS";
import UserAvatar from "../components/UserAvatar";
import SocialLinks from "../components/SocialLinks";
import AppMenu from "@/config/navigations/navigationMenu";
import { RouteConfig } from "@/config/routes";
import { useLayout } from "@/hooks/useLayout";
import LanguageSelector from "@/components/LanguageSelector";
import OverlayBar from "./OverlayBar";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
  routeConfig: RouteConfig | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, routeConfig }) => {
  const { settings } = useSettings();
  const { showGoTop, scrollToTop, isMobile } = useLayout();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const overlayInfo = {
    openingHours: "8:30 AM - 6:00 PM",
    phoneNumber: "+95 9 765432100",
    email: "contact@myanmarbiz.com",
  };

  const siteSettings = settings?.[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS] || {
    siteName: "",
    siteUrl: "",
    siteBanner: "",
    siteLogo: "",
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const siteLogo = siteSettings.siteLogo?.trim() || "/images/logo.svg";
  const siteName = siteSettings.siteName?.trim() || "Site Logo";

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);
  const showGoTopButton = routeConfig?.showGoTop && showGoTop;

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <OverlayBar
        overlayInfo={{
          openingHours: overlayInfo.openingHours,
          phoneNumber: overlayInfo.phoneNumber,
          email: overlayInfo.email,
        }}
      />

      <Header
        className="main-header"
        style={{
          position: "sticky",
          top: "0",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "90px",
          padding: "10px",
          transition: "background 0.3s ease-in-out",
          background: colorBgContainer,
        }}
      >
        <Link
          href="/"
          style={{ height: "80px", display: "flex", alignItems: "center" }}
        >
          {false ? (
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
              {siteName}
            </span>
          ) : (
            <img
              src={siteLogo}
              alt={siteName}
              style={{
                height: "80px",
                objectFit: "contain",
              }}
            />
          )}
        </Link>

        <Space>
          {!isMobile && (
            <AppMenu
              menuMode="horizontal"
              isDashboard={false}
              isMobile={false}
            />
          )}
          <UserAvatar isMobile={isMobile} toggleDrawer={toggleDrawer} />
        </Space>
      </Header>

      <Content
        style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {isMobile && (
          <Drawer
            title="Menu"
            placement="right"
            onClose={toggleDrawer}
            open={drawerVisible}
            styles={{ body: { padding: "24px 0" } }}
          >
            <AppMenu
              menuMode="inline"
              isDashboard={false}
              isMobile={true}
              onMenuClick={toggleDrawer}
            />
          </Drawer>
        )}
        {children}
      </Content>

      <Footer style={{ textAlign: "center", padding: "20px" }}>
        <SocialLinks settings={settings} />
        <Text>
          {siteName} © {new Date().getFullYear()} All rights reserved.
        </Text>
      </Footer>

      {showGoTopButton && (
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<ArrowUpOutlined />}
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 14000,
          }}
        />
      )}
    </Layout>
  );
};

export default MainLayout;
