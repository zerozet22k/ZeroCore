import { User, UserAPI } from "@/models/UserModel";

export const APP_PERMISSIONS = {
  ADMIN: "admin",
  VIEW_DASHBOARD: "view_dashboard",
  EDIT_SETTINGS: "edit_settings",
  EDIT_PAGES: "edit_pages",
  CREATE_USER: "create_user",
  EDIT_USER: "edit_user",
  DELETE_USER: "delete_user",
  VIEW_USERS: "view_users",
  POST_INQUIRY: "post_inquiry",
  EDIT_OWN_INQUIRY: "edit_own_inquiry",
  DELETE_OWN_INQUIRY: "delete_own_inquiry",
  REPLY_TO_OWN_INQUIRY: "reply_to_own_inquiry",
  EDIT_ANY_INQUIRY: "edit_any_inquiry",
  DELETE_ANY_INQUIRY: "delete_any_inquiry",
  REPLY_TO_ANY_INQUIRY: "reply_to_any_inquiry",
  CLOSE_INQUIRY: "close_inquiry",
  AUDIT_INQUIRY: "audit_inquiry",
  UPLOAD_FILE: "upload_file",
  DELETE_FILE: "delete_file",
  VIEW_FILES: "view_files",
  SYNC_FILES: "sync_files",
  BIND_ROLE: "bind_role",
  CREATE_ROLE: "create_role",
  EDIT_ROLE: "edit_role",
  DELETE_ROLE: "delete_role",
  VIEW_ROLES: "view_roles",
  // Newsletter Permissions
  CREATE_NEWSLETTER: "create_newsletter",
  EDIT_NEWSLETTER: "edit_newsletter",
  DELETE_NEWSLETTER: "delete_newsletter",
  VIEW_NEWSLETTER: "view_newsletter",
  UPLOAD_NEWSLETTER_ATTACHMENT: "upload_newsletter_attachment",
  DELETE_NEWSLETTER_ATTACHMENT: "delete_newsletter_attachment",
  EDIT_NEWSLETTER_ATTACHMENT: "edit_newsletter_attachment",
} as const;

export type AppPermissionType =
  (typeof APP_PERMISSIONS)[keyof typeof APP_PERMISSIONS];

export const PERMISSION_GROUPS: Record<string, AppPermissionType[]> = {
  MANAGE_USERS: [
    APP_PERMISSIONS.CREATE_USER,
    APP_PERMISSIONS.EDIT_USER,
    APP_PERMISSIONS.DELETE_USER,
    APP_PERMISSIONS.VIEW_USERS,
  ],
  MANAGE_OWN_INQUIRIES: [
    APP_PERMISSIONS.POST_INQUIRY,
    APP_PERMISSIONS.EDIT_OWN_INQUIRY,
    APP_PERMISSIONS.DELETE_OWN_INQUIRY,
    APP_PERMISSIONS.REPLY_TO_OWN_INQUIRY,
  ],
  MANAGE_ALL_INQUIRIES: [
    APP_PERMISSIONS.EDIT_ANY_INQUIRY,
    APP_PERMISSIONS.DELETE_ANY_INQUIRY,
    APP_PERMISSIONS.REPLY_TO_ANY_INQUIRY,
    APP_PERMISSIONS.CLOSE_INQUIRY,
    APP_PERMISSIONS.AUDIT_INQUIRY,
  ],
  MANAGE_FILES: [
    APP_PERMISSIONS.UPLOAD_FILE,
    APP_PERMISSIONS.DELETE_FILE,
    APP_PERMISSIONS.VIEW_FILES,
  ],
  MANAGE_ROLES: [
    APP_PERMISSIONS.BIND_ROLE,
    APP_PERMISSIONS.CREATE_ROLE,
    APP_PERMISSIONS.EDIT_ROLE,
    APP_PERMISSIONS.DELETE_ROLE,
    APP_PERMISSIONS.VIEW_ROLES,
  ],
  MANAGE_NEWSLETTERS: [
    APP_PERMISSIONS.CREATE_NEWSLETTER,
    APP_PERMISSIONS.EDIT_NEWSLETTER,
    APP_PERMISSIONS.DELETE_NEWSLETTER,
    APP_PERMISSIONS.VIEW_NEWSLETTER,
    APP_PERMISSIONS.UPLOAD_NEWSLETTER_ATTACHMENT,
    APP_PERMISSIONS.DELETE_NEWSLETTER_ATTACHMENT,
    APP_PERMISSIONS.EDIT_NEWSLETTER_ATTACHMENT,
  ],
  ACCESS: [
    APP_PERMISSIONS.ADMIN,
    APP_PERMISSIONS.VIEW_DASHBOARD,
    APP_PERMISSIONS.EDIT_SETTINGS,
    APP_PERMISSIONS.EDIT_PAGES,
  ],
};

export const ALL_PERMISSIONS = Object.values(APP_PERMISSIONS);

export const FREE_PERMISSIONS: AppPermissionType[] = [
  APP_PERMISSIONS.POST_INQUIRY,
  APP_PERMISSIONS.EDIT_OWN_INQUIRY,
  APP_PERMISSIONS.DELETE_OWN_INQUIRY,
  APP_PERMISSIONS.REPLY_TO_OWN_INQUIRY,
];

export const GUEST_APP_PERMISSIONS: AppPermissionType[] = [...FREE_PERMISSIONS];

export const PERMISSION_GUIDE: Record<AppPermissionType, string> = {
  [APP_PERMISSIONS.VIEW_DASHBOARD]: "Allows access to the dashboard.",
  [APP_PERMISSIONS.ADMIN]:
    "Allows full administrative privileges for data-fetching.",
  [APP_PERMISSIONS.EDIT_SETTINGS]: "Allows editing global platform settings.",
  [APP_PERMISSIONS.EDIT_PAGES]: "Allows editing page settings.",
  [APP_PERMISSIONS.CREATE_USER]: "Allows creating new users.",
  [APP_PERMISSIONS.EDIT_USER]: "Allows editing existing users.",
  [APP_PERMISSIONS.DELETE_USER]: "Allows deleting users.",
  [APP_PERMISSIONS.VIEW_USERS]: "Allows viewing user lists and details.",
  [APP_PERMISSIONS.POST_INQUIRY]: "Allows submitting new inquiries.",
  [APP_PERMISSIONS.EDIT_OWN_INQUIRY]: "Allows editing own inquiries.",
  [APP_PERMISSIONS.DELETE_OWN_INQUIRY]: "Allows deleting own inquiries.",
  [APP_PERMISSIONS.REPLY_TO_OWN_INQUIRY]: "Allows replying to own inquiries.",
  [APP_PERMISSIONS.EDIT_ANY_INQUIRY]:
    "Allows editing any inquiry (admin/mods).",
  [APP_PERMISSIONS.DELETE_ANY_INQUIRY]:
    "Allows deleting any inquiry (admin/mods).",
  [APP_PERMISSIONS.REPLY_TO_ANY_INQUIRY]:
    "Allows replying to any inquiry (admin/mods).",
  [APP_PERMISSIONS.CLOSE_INQUIRY]: "Allows closing any inquiry (admin/mods).",
  [APP_PERMISSIONS.AUDIT_INQUIRY]: "Allows admins to review/manage inquiries.",
  [APP_PERMISSIONS.UPLOAD_FILE]: "Allows uploading new files.",
  [APP_PERMISSIONS.DELETE_FILE]: "Allows deleting uploaded files.",
  [APP_PERMISSIONS.VIEW_FILES]: "Allows viewing files but not modifying them.",
  [APP_PERMISSIONS.SYNC_FILES]: "Allows syncing files.",
  [APP_PERMISSIONS.BIND_ROLE]: "Allows binding roles.",
  [APP_PERMISSIONS.CREATE_ROLE]: "Allows creating new roles.",
  [APP_PERMISSIONS.EDIT_ROLE]: "Allows editing roles.",
  [APP_PERMISSIONS.DELETE_ROLE]: "Allows deleting roles.",
  [APP_PERMISSIONS.VIEW_ROLES]: "Allows viewing existing roles.",
  // Newsletter Permission guides:
  [APP_PERMISSIONS.CREATE_NEWSLETTER]: "Allows creating new newsletters.",
  [APP_PERMISSIONS.EDIT_NEWSLETTER]: "Allows editing existing newsletters.",
  [APP_PERMISSIONS.DELETE_NEWSLETTER]: "Allows deleting newsletters.",
  [APP_PERMISSIONS.VIEW_NEWSLETTER]: "Allows viewing newsletters.",
  [APP_PERMISSIONS.UPLOAD_NEWSLETTER_ATTACHMENT]:
    "Allows uploading attachments for newsletters.",
  [APP_PERMISSIONS.DELETE_NEWSLETTER_ATTACHMENT]:
    "Allows deleting newsletter attachments.",
  [APP_PERMISSIONS.EDIT_NEWSLETTER_ATTACHMENT]:
    "Allows editing newsletter attachment details.",
};

export const checkPermission = (
  user: User | UserAPI | null,
  requiredPermissions: AppPermissionType[],
  checkAll: boolean = true
): boolean => {
  if (!user?.roles?.length) return false;

  return checkAll
    ? requiredPermissions.every((perm) =>
        user.roles.some((role) => role.permissions.includes(perm))
      )
    : requiredPermissions.some((perm) =>
        user.roles.some((role) => role.permissions.includes(perm))
      );
};

export const hasPermission = (
  user: User | UserAPI | null,
  requiredPermissions: AppPermissionType[]
): boolean => {
  if (!user?.roles?.length) return false;

  return requiredPermissions.some((perm) =>
    user.roles.some((role) => role.permissions.includes(perm))
  );
};

export const hasGroupPermission = (
  user: User | UserAPI | null,
  permissionGroup: keyof typeof PERMISSION_GROUPS
): boolean => {
  if (!user?.roles?.length) return false;

  const requiredPermissions = PERMISSION_GROUPS[permissionGroup];

  return requiredPermissions.some((perm) =>
    user.roles.some((role) => role.permissions.includes(perm))
  );
};

export const hasFullGroupPermission = (
  user: User | UserAPI | null,
  permissionGroup: keyof typeof PERMISSION_GROUPS
): boolean => {
  if (!user?.roles?.length) return false;

  const requiredPermissions = PERMISSION_GROUPS[permissionGroup];

  return requiredPermissions.every((perm) =>
    user.roles.some((role) => role.permissions.includes(perm))
  );
};
