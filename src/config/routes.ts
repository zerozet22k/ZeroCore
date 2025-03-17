import { APP_PERMISSIONS, AppPermissionType } from "./permissions";

export const PARENT_KEYS = {
  USERS: { key: "users", icon: "TeamOutlined", label: "Users" },
  ROLES: { key: "roles", icon: "TeamOutlined", label: "Roles" },
  FILES: { key: "files", icon: "UploadOutlined", label: "Files" },
  NEWSLETTERS: {
    key: "newsletters",
    icon: "MailOutlined",
    label: "Newsletters",
  },
} as const;

export const ROUTE_KEYS = {
  DASHBOARD: "dashboard",
  USER_LIST: "user-list",
  CREATE_USER: "create-user",
  EDIT_USER: "edit-user",
  ROLES_LIST: "roles-list",
  CREATE_ROLE: "create-role",
  EDIT_ROLE: "edit-role",
  FILES_LIST: "files-list",
  UPLOAD_FILE: "upload-file",
  SETTINGS: "settings",
  PAGES: "pages",
  HOME: "home",
  ABOUT: "about",
  SERVICES: "services",
  TEAM_MEMBERS: "team-members",
  LOGIN: "login",
  REGISTER: "register",
  FORGOT_PASSWORD: "forgot-password",
  PROFILE: "profile",

  // INQUIRY: "inquiry",
  // INQUIRY_INFO: "inquiry-info",

  NEWSLETTER_LIST: "newsletter-list",
  CREATE_NEWSLETTER: "create-newsletter",
  EDIT_NEWSLETTER: "edit-newsletter",

  NEWSLETTERS: "newsletters",
  NEWSLETTER_INFO: "newsletters-info",
} as const;

export type RouteKey = (typeof ROUTE_KEYS)[keyof typeof ROUTE_KEYS];

export const dashboardRoute = "/dashboard";

export type RouteConfig = {
  key: RouteKey;
  path: string;
  label?: string;
  icon?: string | null;
  access?: AppPermissionType[];
  loginRequired?: boolean;
  IfNotLoggedInRedirectUrl?: string;
  IfLoggedInRedirectUrl?: string;
  noAccessMessage?: string;
  exactMatch?: boolean;
  showGoTop?: boolean;
};

export const ROUTES: Record<RouteKey, RouteConfig> = {
  [ROUTE_KEYS.DASHBOARD]: {
    key: ROUTE_KEYS.DASHBOARD,
    path: dashboardRoute,
    label: "Dashboard",
    icon: "DashboardOutlined",
    access: [APP_PERMISSIONS.VIEW_DASHBOARD],
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/dashboard",
  },

  [ROUTE_KEYS.PROFILE]: {
    key: ROUTE_KEYS.PROFILE,
    path: "/profile",
    label: "Profile",
    icon: "UserOutlined",
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/profile",
  },

  [ROUTE_KEYS.USER_LIST]: {
    key: ROUTE_KEYS.USER_LIST,
    path: `${dashboardRoute}/users`,
    label: "Users List",
    icon: "TeamOutlined",
    access: [APP_PERMISSIONS.VIEW_USERS, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.CREATE_USER]: {
    key: ROUTE_KEYS.CREATE_USER,
    path: `${dashboardRoute}/users/create`,
    label: "Create User",
    icon: "UserOutlined",
    access: [APP_PERMISSIONS.CREATE_USER, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.EDIT_USER]: {
    key: ROUTE_KEYS.EDIT_USER,
    path: `${dashboardRoute}/users/edit/:id`,
    label: "Edit User",
    icon: null,
    access: [APP_PERMISSIONS.EDIT_USER, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    exactMatch: true,
    noAccessMessage: "You do not have permission to edit this user.",
  },

  [ROUTE_KEYS.ROLES_LIST]: {
    key: ROUTE_KEYS.ROLES_LIST,
    path: `${dashboardRoute}/roles`,
    label: "Roles List",
    icon: "TeamOutlined",
    access: [APP_PERMISSIONS.VIEW_ROLES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.CREATE_ROLE]: {
    key: ROUTE_KEYS.CREATE_ROLE,
    path: `${dashboardRoute}/roles/create`,
    label: "Create Role",
    icon: "FormOutlined",
    access: [APP_PERMISSIONS.CREATE_ROLE, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.EDIT_ROLE]: {
    key: ROUTE_KEYS.EDIT_ROLE,
    path: `${dashboardRoute}/roles/edit/:id`,
    label: "Edit Role",
    icon: null,
    access: [APP_PERMISSIONS.EDIT_ROLE, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    exactMatch: true,
  },

  [ROUTE_KEYS.NEWSLETTER_LIST]: {
    key: ROUTE_KEYS.NEWSLETTER_LIST,
    path: `${dashboardRoute}/newsletters`,
    label: "Newsletters",
    icon: "MailOutlined",
    access: [APP_PERMISSIONS.VIEW_NEWSLETTER, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/dashboard/newsletters",
  },

  [ROUTE_KEYS.CREATE_NEWSLETTER]: {
    key: ROUTE_KEYS.CREATE_NEWSLETTER,
    path: `${dashboardRoute}/newsletters/create`,
    label: "Create Newsletter",
    icon: "EditOutlined",
    access: [APP_PERMISSIONS.CREATE_NEWSLETTER, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.EDIT_NEWSLETTER]: {
    key: ROUTE_KEYS.EDIT_NEWSLETTER,
    path: `${dashboardRoute}/newsletters/:id`,
    label: "Edit Newsletter",
    icon: null,
    access: [APP_PERMISSIONS.EDIT_NEWSLETTER, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    noAccessMessage: "You do not have permission to edit this newsletter.",
    exactMatch: true,
  },

  [ROUTE_KEYS.FILES_LIST]: {
    key: ROUTE_KEYS.FILES_LIST,
    path: `${dashboardRoute}/files`,
    label: "Files List",
    icon: "FolderOutlined",
    access: [APP_PERMISSIONS.VIEW_FILES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/dashboard/files",
    noAccessMessage: "You do not have permission to view files.",
  },
  [ROUTE_KEYS.UPLOAD_FILE]: {
    key: ROUTE_KEYS.UPLOAD_FILE,
    path: `${dashboardRoute}/files/upload`,
    label: "Upload File",
    icon: "UploadOutlined",
    access: [APP_PERMISSIONS.UPLOAD_FILE, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/dashboard/files/upload",
    noAccessMessage: "You do not have permission to upload files.",
  },

  [ROUTE_KEYS.SETTINGS]: {
    key: ROUTE_KEYS.SETTINGS,
    path: `${dashboardRoute}/settings`,
    label: "Settings",
    icon: "SettingOutlined",
    access: [APP_PERMISSIONS.EDIT_SETTINGS, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.PAGES]: {
    key: ROUTE_KEYS.PAGES,
    path: `${dashboardRoute}/pages`,
    label: "Pages",
    icon: "FileTextOutlined",
    access: [APP_PERMISSIONS.EDIT_PAGES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },

  [ROUTE_KEYS.HOME]: {
    key: ROUTE_KEYS.HOME,
    path: "/",
    label: "Home",
    icon: "HomeOutlined",
    loginRequired: false,
    showGoTop: true,
  },
  [ROUTE_KEYS.ABOUT]: {
    key: ROUTE_KEYS.ABOUT,
    path: "/about",
    label: "About",
    icon: "InfoCircleOutlined",
    loginRequired: false,
    showGoTop: true,
  },
  [ROUTE_KEYS.SERVICES]: {
    key: ROUTE_KEYS.SERVICES,
    path: "/services",
    label: "Services",
    icon: "AppstoreOutlined",
    loginRequired: false,
    showGoTop: true,
  },

  [ROUTE_KEYS.TEAM_MEMBERS]: {
    key: ROUTE_KEYS.TEAM_MEMBERS,
    path: "/team-members",
    label: "Team Members",
    icon: "SolutionOutlined",
    loginRequired: false,
    showGoTop: true,
  },
  // [ROUTE_KEYS.INQUIRY]: {
  //   key: ROUTE_KEYS.INQUIRY,
  //   path: "/inquiry",
  //   label: "Inquiry",
  //   icon: "FileTextOutlined",
  //   loginRequired: false,
  //   showGoTop: true,
  // },
  // [ROUTE_KEYS.INQUIRY_INFO]: {
  //   key: ROUTE_KEYS.INQUIRY_INFO,
  //   path: "/inquiry/:id",
  //   label: "Inquiry Info",
  //   icon: "FileTextOutlined",
  //   loginRequired: false,
  //   showGoTop: true,
  // },
  [ROUTE_KEYS.NEWSLETTERS]: {
    key: ROUTE_KEYS.NEWSLETTERS,
    path: "/newsletters",
    label: "Newsletters",
    icon: "FileTextOutlined",
    loginRequired: false,
    showGoTop: true,
  },
  [ROUTE_KEYS.NEWSLETTER_INFO]: {
    key: ROUTE_KEYS.NEWSLETTER_INFO,
    path: "/newsletters/:id",
    label: "Newsletters Info",
    icon: "FileTextOutlined",
    loginRequired: false,
    showGoTop: true,
  },

  [ROUTE_KEYS.LOGIN]: {
    key: ROUTE_KEYS.LOGIN,
    path: "/login",
    IfLoggedInRedirectUrl: "/dashboard",
  },
  [ROUTE_KEYS.REGISTER]: {
    key: ROUTE_KEYS.REGISTER,
    path: "/signup",
    IfLoggedInRedirectUrl: "/dashboard",
  },
  [ROUTE_KEYS.FORGOT_PASSWORD]: {
    key: ROUTE_KEYS.FORGOT_PASSWORD,
    path: "/forget-password",
    label: "Forgot Password",
    icon: "KeyOutlined",
    IfLoggedInRedirectUrl: "/dashboard",
  },
};
