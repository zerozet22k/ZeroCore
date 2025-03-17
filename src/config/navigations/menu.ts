import { APP_PERMISSIONS } from "../permissions";
import { ROUTES, ROUTE_KEYS, PARENT_KEYS } from "../routes";

export interface NavigationMenuItem {
  key: string;
  icon?: string;
  label: string;
  link?: string;
  children?: NavigationMenuItem[];
  access?: (typeof APP_PERMISSIONS)[keyof typeof APP_PERMISSIONS][];
}

export const dashboardMenu: NavigationMenuItem[] = [
  {
    key: ROUTE_KEYS.DASHBOARD,
    icon: ROUTES[ROUTE_KEYS.DASHBOARD].icon!,
    label: ROUTES[ROUTE_KEYS.DASHBOARD].label!,
    link: ROUTES[ROUTE_KEYS.DASHBOARD].path,
    access: ROUTES[ROUTE_KEYS.DASHBOARD].access,
  },
  {
    key: PARENT_KEYS.USERS.key,
    icon: PARENT_KEYS.USERS.icon!,
    label: PARENT_KEYS.USERS.label,
    access: [APP_PERMISSIONS.VIEW_USERS, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.CREATE_USER,
        label: ROUTES[ROUTE_KEYS.CREATE_USER].label!,
        link: ROUTES[ROUTE_KEYS.CREATE_USER].path,
        icon: ROUTES[ROUTE_KEYS.CREATE_USER].icon!,
        access: ROUTES[ROUTE_KEYS.CREATE_USER].access,
      },
      {
        key: ROUTE_KEYS.USER_LIST,
        label: ROUTES[ROUTE_KEYS.USER_LIST].label!,
        link: ROUTES[ROUTE_KEYS.USER_LIST].path,
        icon: ROUTES[ROUTE_KEYS.USER_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.USER_LIST].access,
      },
    ],
  },
  {
    key: PARENT_KEYS.ROLES.key,
    icon: PARENT_KEYS.ROLES.icon!,
    label: PARENT_KEYS.ROLES.label,
    access: [APP_PERMISSIONS.VIEW_ROLES, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.CREATE_ROLE,
        label: ROUTES[ROUTE_KEYS.CREATE_ROLE].label!,
        link: ROUTES[ROUTE_KEYS.CREATE_ROLE].path,
        icon: ROUTES[ROUTE_KEYS.CREATE_ROLE].icon!,
        access: ROUTES[ROUTE_KEYS.CREATE_ROLE].access,
      },
      {
        key: ROUTE_KEYS.ROLES_LIST,
        label: ROUTES[ROUTE_KEYS.ROLES_LIST].label!,
        link: ROUTES[ROUTE_KEYS.ROLES_LIST].path,
        icon: ROUTES[ROUTE_KEYS.ROLES_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.ROLES_LIST].access,
      },
    ],
  },
  {
    key: PARENT_KEYS.NEWSLETTERS.key,
    icon: PARENT_KEYS.NEWSLETTERS.icon!,
    label: PARENT_KEYS.NEWSLETTERS.label,
    access: [APP_PERMISSIONS.VIEW_NEWSLETTER, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.CREATE_NEWSLETTER,
        label: ROUTES[ROUTE_KEYS.CREATE_NEWSLETTER].label!,
        link: ROUTES[ROUTE_KEYS.CREATE_NEWSLETTER].path,
        icon: ROUTES[ROUTE_KEYS.CREATE_NEWSLETTER].icon!,
        access: ROUTES[ROUTE_KEYS.CREATE_NEWSLETTER].access,
      },
      {
        key: ROUTE_KEYS.NEWSLETTER_LIST,
        label: ROUTES[ROUTE_KEYS.NEWSLETTER_LIST].label!,
        link: ROUTES[ROUTE_KEYS.NEWSLETTER_LIST].path,
        icon: ROUTES[ROUTE_KEYS.NEWSLETTER_LIST].icon!,
        access: [APP_PERMISSIONS.VIEW_NEWSLETTER, APP_PERMISSIONS.ADMIN],
      },
    ],
  },

  {
    key: PARENT_KEYS.FILES.key,
    icon: PARENT_KEYS.FILES.icon!,
    label: PARENT_KEYS.FILES.label,
    access: [APP_PERMISSIONS.VIEW_FILES, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.UPLOAD_FILE,
        label: ROUTES[ROUTE_KEYS.UPLOAD_FILE].label!,
        link: ROUTES[ROUTE_KEYS.UPLOAD_FILE].path,
        icon: ROUTES[ROUTE_KEYS.UPLOAD_FILE].icon!,
        access: ROUTES[ROUTE_KEYS.UPLOAD_FILE].access,
      },
      {
        key: ROUTE_KEYS.FILES_LIST,
        label: ROUTES[ROUTE_KEYS.FILES_LIST].label!,
        link: ROUTES[ROUTE_KEYS.FILES_LIST].path,
        icon: ROUTES[ROUTE_KEYS.FILES_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.FILES_LIST].access,
      },
    ],
  },
  {
    key: ROUTE_KEYS.PAGES,
    icon: ROUTES[ROUTE_KEYS.PAGES].icon!,
    label: ROUTES[ROUTE_KEYS.PAGES].label!,
    link: ROUTES[ROUTE_KEYS.PAGES].path,
    access: ROUTES[ROUTE_KEYS.PAGES].access,
  },
  {
    key: ROUTE_KEYS.SETTINGS,
    icon: ROUTES[ROUTE_KEYS.SETTINGS].icon!,
    label: ROUTES[ROUTE_KEYS.SETTINGS].label!,
    link: ROUTES[ROUTE_KEYS.SETTINGS].path,
    access: ROUTES[ROUTE_KEYS.SETTINGS].access,
  },
];

export const mainMenu: NavigationMenuItem[] = [
  {
    key: ROUTE_KEYS.HOME,
    icon: ROUTES[ROUTE_KEYS.HOME].icon!,
    label: ROUTES[ROUTE_KEYS.HOME].label!,
    link: ROUTES[ROUTE_KEYS.HOME].path,
  },
  {
    key: ROUTE_KEYS.ABOUT,
    icon: ROUTES[ROUTE_KEYS.ABOUT].icon!,
    label: ROUTES[ROUTE_KEYS.ABOUT].label!,
    link: ROUTES[ROUTE_KEYS.ABOUT].path,
  },
  {
    key: ROUTE_KEYS.SERVICES,
    icon: ROUTES[ROUTE_KEYS.SERVICES].icon!,
    label: ROUTES[ROUTE_KEYS.SERVICES].label!,
    link: ROUTES[ROUTE_KEYS.SERVICES].path,
  },
  {
    key: ROUTE_KEYS.TEAM_MEMBERS,
    icon: ROUTES[ROUTE_KEYS.TEAM_MEMBERS].icon!,
    label: ROUTES[ROUTE_KEYS.TEAM_MEMBERS].label!,
    link: ROUTES[ROUTE_KEYS.TEAM_MEMBERS].path,
  },

  {
    key: ROUTE_KEYS.NEWSLETTERS,
    icon: ROUTES[ROUTE_KEYS.NEWSLETTERS].icon!,
    label: ROUTES[ROUTE_KEYS.NEWSLETTERS].label!,
    link: ROUTES[ROUTE_KEYS.NEWSLETTERS].path,
  },
];
