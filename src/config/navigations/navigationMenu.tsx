import React from "react";
import Link from "next/link";
import { Menu, MenuProps } from "antd";
import { useUser } from "@/hooks/useUser";
import { UserAPI } from "@/models/UserModel";
import { hasPermission } from "../permissions";

import { usePathname } from "next/navigation";
import {
  dashboardMenu,
  mainMenu,
  NavigationMenuItem,
} from "@/config/navigations/menu";
import { DynamicIcon } from "./IconMapper";

const buildMenu = (
  user: UserAPI | null,
  menuConfig: NavigationMenuItem[]
): NavigationMenuItem[] => {
  const filterNavigationMenuItems = (
    menu: NavigationMenuItem
  ): NavigationMenuItem | null => {
    if (menu.access && !hasPermission(user, menu.access)) return null;
    if (menu.children) {
      const filteredChildren = menu.children
        .map(filterNavigationMenuItems)
        .filter((item): item is NavigationMenuItem => item !== null);
      return filteredChildren.length > 0
        ? { ...menu, children: filteredChildren }
        : null;
    }
    return menu;
  };

  return menuConfig
    .map(filterNavigationMenuItems)
    .filter((item): item is NavigationMenuItem => item !== null);
};

const generateNavigationMenuItems = (
  menuData: NavigationMenuItem[]
): MenuProps["items"] => {
  return menuData.map((menu) => ({
    key: menu.key,
    icon: menu.icon ? DynamicIcon({ name: menu.icon }) : null,
    label: menu.link ? (
      <Link href={menu.link} passHref>
        {menu.label}
      </Link>
    ) : (
      <span>{menu.label}</span>
    ),
    children: menu.children
      ? generateNavigationMenuItems(menu.children)
      : undefined,
  }));
};
export const getSelectedKey = (
  user: UserAPI | null,
  pathname: string,
  isDashboard: boolean
): string | undefined => {
  const menuData = buildMenu(user, isDashboard ? dashboardMenu : mainMenu);

  return menuData
    .flatMap((item) => [item, ...(item.children || [])])
    .find((item) => item.link === pathname)?.key;
};

interface AppMenuProps {
  menuMode?: MenuProps["mode"];
  isDashboard: boolean;
  isMobile: boolean;
  onMenuClick?: MenuProps["onClick"];
}
const AppMenu: React.FC<AppMenuProps> = ({
  menuMode = "vertical",
  isDashboard,
  isMobile,
  onMenuClick,
}) => {
  const { user, logout } = useUser();
  const pathname = usePathname();

  const menuConfig = isDashboard ? dashboardMenu : mainMenu;
  const NavigationMenuItems = buildMenu(user, menuConfig);
  const items = generateNavigationMenuItems(NavigationMenuItems) ?? [];

  const selectedKey = getSelectedKey(user, pathname, isDashboard);

  if (isMobile) {
    if (user) {
      items.push({
        key: "logout",
        icon: DynamicIcon({ name: "LogoutOutlined" }),
        label: <span onClick={() => logout()}>Logout</span>,
      });
    } else {
      items.push({
        key: "login",
        icon: DynamicIcon({ name: "LogoutOutlined" }),
        label: (
          <Link href="/login" passHref>
            Login
          </Link>
        ),
      });
    }
  }

  return (
    <Menu
      mode={menuMode}
      items={items}
      onClick={onMenuClick}
      selectedKeys={selectedKey ? [selectedKey] : []}
    />
  );
};

export default AppMenu;
