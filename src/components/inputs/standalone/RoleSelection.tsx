import React from "react";
import PublicAPIDynamicDropdown from "../PublicAPIDynamicDropdown";

interface RoleSelectionProps {
  value?: string;
  onChange?: (value: string) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ value, onChange }) => {
  return (
    <PublicAPIDynamicDropdown
      type="roles"
      valueKey="_id"
      labelKey="name"
      placeholder="Select a role"
      value={value}
      onChange={onChange}
    />
  );
};

export default RoleSelection;
