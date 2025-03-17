"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  message,
  Row,
  Col,
  Tooltip,
  Alert,
} from "antd";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import { RoleAPI, RoleType } from "@/models/RoleModel";
import {
  APP_PERMISSIONS,
  PERMISSION_GROUPS,
  PERMISSION_GUIDE,
  FREE_PERMISSIONS,
  AppPermissionType,
} from "@/config/permissions";
import { useUser } from "@/hooks/useUser";
import { getHighestRoleWithPermission } from "@/utils/roleUtils";

interface RoleFormProps {
  role?: RoleAPI;
}

/**
 * In this logic:
 * - A higher numeric 'level' means higher authority (e.g. level=100 is top).
 * - The user with level=100 can only create/edit roles with level < 100.
 * - FREE_PERMISSIONS are always delegated, so they are auto‑added and always checked.
 */
const RoleForm: React.FC<RoleFormProps> = ({ role }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<
    AppPermissionType[]
  >(role?.permissions || []);
  const router = useRouter();
  const isSystemRole = role?.type === RoleType.SYSTEM;

  const { user } = useUser();
  const highestEditableRole = getHighestRoleWithPermission(
    user,
    APP_PERMISSIONS.EDIT_ROLE
  );

  // Aggregate permissions that the current user has
  const userPermissions: AppPermissionType[] = user?.roles
    ? Array.from(new Set(user.roles.flatMap((r) => r.permissions)))
    : [];

  // When editing, allow if role.level < highestEditableRole.level
  const canEditRole =
    highestEditableRole && role ? role.level < highestEditableRole.level : true;
  const canCreateRole = !!highestEditableRole;

  // Always ensure free permissions are in selectedPermissions.
  const ensureFreePerms = (perms: AppPermissionType[]) =>
    Array.from(new Set([...perms, ...FREE_PERMISSIONS]));

  // Initialize form fields and set free permissions automatically.
  useEffect(() => {
    if (role) {
      const initColor =
        role.color && /^#[0-9A-Fa-f]{6}$/.test(role.color)
          ? role.color
          : "#ffffff";
      form.setFieldsValue({ ...role, color: initColor });
      setSelectedPermissions(ensureFreePerms(role.permissions || []));
    } else {
      form.setFieldsValue({ color: "#ffffff" });
      setSelectedPermissions(ensureFreePerms([]));
    }
  }, [role, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    // Merge in free permissions regardless of user selection.
    values.permissions = ensureFreePerms(selectedPermissions);

    if (!highestEditableRole) {
      message.error("You do not have permission to create or edit roles.");
      setLoading(false);
      return;
    }

    // New role's level must be strictly less than highestEditableRole.level.
    if (values.level >= highestEditableRole.level) {
      message.error(
        `Role level must be strictly less than ${highestEditableRole.level}.`
      );
      setLoading(false);
      return;
    }

    // Validate that each non-free permission is one the user already has.
    const invalidPerms = values.permissions.filter(
      (perm: AppPermissionType) =>
        !FREE_PERMISSIONS.includes(perm) && !userPermissions.includes(perm)
    );
    if (invalidPerms.length > 0) {
      message.error(
        `You cannot delegate permission(s): ${invalidPerms.join(", ")}`
      );
      setLoading(false);
      return;
    }

    try {
      if (role?._id) {
        await apiClient.put(`/roles/${role._id}`, values);
        message.success("Role updated successfully!");
      } else {
        values.type = "custom";
        await apiClient.post("/roles", values);
        message.success("Role created successfully!");
      }
      form.resetFields();
      router.push("/dashboard/roles");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to submit the form.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // For group toggle, add free-permission checkboxes automatically.
  const handleToggleGroup = (checked: boolean, perms: AppPermissionType[]) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        perms.forEach((perm) => {
          if (
            FREE_PERMISSIONS.includes(perm) ||
            userPermissions.includes(perm)
          ) {
            newSet.add(perm);
          }
        });
      } else {
        perms.forEach((perm) => newSet.delete(perm));
      }
      return Array.from(newSet);
    });
  };

  // For individual permission toggle.
  const handleTogglePermission = (
    checked: boolean,
    perm: AppPermissionType
  ) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        if (FREE_PERMISSIONS.includes(perm) || userPermissions.includes(perm)) {
          newSet.add(perm);
        }
      } else {
        // If free, we don't allow removal; they must always be included.
        if (!FREE_PERMISSIONS.includes(perm)) {
          newSet.delete(perm);
        }
      }
      return Array.from(newSet);
    });
  };

  return (
    <Card
      title={role ? "Edit Role" : "Create Role"}
      style={{
        maxWidth: 600,
        margin: "20px auto",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {isSystemRole && (
        <Alert
          message="You are not allowed to edit permissions for this system role."
          type="warning"
          showIcon
          style={{ marginBottom: 10 }}
        />
      )}
      {!isSystemRole && !highestEditableRole && (
        <Alert
          message="You do not have permission to create or edit roles."
          type="error"
          showIcon
          style={{ marginBottom: 10 }}
        />
      )}
      {!isSystemRole && role && !canEditRole && (
        <Alert
          message="You cannot edit this role because it has equal or higher authority than your highest editable role."
          type="error"
          showIcon
          style={{ marginBottom: 10 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        disabled={!canCreateRole || (role && !canEditRole)}
      >
        <Form.Item
          label="Role Name"
          name="name"
          rules={[{ required: true, message: "Please enter the role name" }]}
        >
          <Input autoComplete="off" placeholder="Enter role name" />
        </Form.Item>

        <Form.Item
          label="Role Color"
          name="color"
          rules={[
            { required: true, message: "Please select a color" },
            {
              pattern: /^#[0-9A-Fa-f]{6}$/,
              message: 'Color must be in the format "#rrggbb"',
            },
          ]}
        >
          <Input type="color" style={{ width: "100%" }} />
        </Form.Item>

        {/* New roles must have a level strictly less than the highestEditableRole.level */}
        <Form.Item
          label="Role Level"
          name="level"
          rules={[{ required: true, message: "Please enter the role level" }]}
        >
          <Input
            type="number"
            max={highestEditableRole ? highestEditableRole.level - 1 : 1}
            placeholder="Enter a level lower than your own"
            disabled={!canCreateRole || (role && !canEditRole)}
          />
        </Form.Item>

        <Form.Item label="Permissions">
          <div
            style={{
              position: "relative",
              pointerEvents: isSystemRole ? "none" : "auto",
            }}
          >
            {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
              const groupEnabled = perms.some(
                (perm) =>
                  FREE_PERMISSIONS.includes(perm) ||
                  userPermissions.includes(perm)
              );
              const allSelected = perms.every((perm) =>
                selectedPermissions.includes(perm)
              );
              const someSelected = perms.some((perm) =>
                selectedPermissions.includes(perm)
              );

              return (
                <div
                  key={group}
                  style={{
                    marginBottom: 10,
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                  }}
                >
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={(e) => handleToggleGroup(e.target.checked, perms)}
                    style={{ fontWeight: "bold" }}
                    disabled={isSystemRole || !groupEnabled}
                  >
                    {group.replace("_", " ")}
                  </Checkbox>

                  <Row
                    gutter={[10, 10]}
                    style={{ marginLeft: 20, marginTop: 5 }}
                  >
                    {perms.map((perm) => {
                      // For free permissions, always check and disable toggling.
                      const isFree = FREE_PERMISSIONS.includes(perm);
                      const disabledCheckbox =
                        isSystemRole ||
                        (!isFree && !userPermissions.includes(perm));
                      return (
                        <Col xs={24} sm={12} key={perm}>
                          <Tooltip
                            title={
                              PERMISSION_GUIDE[perm] ||
                              "No description available"
                            }
                          >
                            <Checkbox
                              checked={
                                true && isFree
                                  ? true
                                  : selectedPermissions.includes(perm)
                              }
                              onChange={(e) =>
                                handleTogglePermission(e.target.checked, perm)
                              }
                              disabled={isFree || disabledCheckbox}
                            >
                              {perm.replace("_", " ").toUpperCase()}
                            </Checkbox>
                          </Tooltip>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              );
            })}
            {isSystemRole && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "5px",
                }}
              />
            )}
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {role ? "Update Role" : "Create Role"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RoleForm;
