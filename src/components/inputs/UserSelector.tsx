import React from "react";
import PublicAPIDynamicDropdown from "./PublicAPIDynamicDropdown";

interface UserSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ value, onChange }) => {
  return (
    <PublicAPIDynamicDropdown
      type="users"
      valueKey="_id"
      labelKey="username"
      placeholder="Select a user"
      value={value}
      onChange={onChange}
    />
  );
};

export default UserSelector;
