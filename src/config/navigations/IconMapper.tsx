import * as AntIcons from "@ant-design/icons";
import { Spin } from "antd";
import { Suspense, FC, CSSProperties } from "react";

const isValidIcon = (key: string): boolean => {
  return (
    key.endsWith("Outlined") ||
    key.endsWith("Filled") ||
    key.endsWith("TwoTone")
  );
};

export const IconKeys = Object.keys(AntIcons).filter(isValidIcon) as string[];

export type IconType = (typeof IconKeys)[number];

const getIconComponent = (iconName: string): FC<any> | null => {
  const Component = AntIcons[iconName as keyof typeof AntIcons];

  if (!Component || typeof Component !== "object") {
    console.error(`Invalid Ant Design Icon: ${iconName}`);
    return null;
  }

  return Component as FC<any>;
};
interface DynamicIconProps {
  name: string;
  style?: CSSProperties;
}
export const DynamicIcon: FC<DynamicIconProps> = ({ name, style }) => {
  if (!name || !IconKeys.includes(name)) {
    console.warn(`Icon "${name}" is not a valid Ant Design icon.`);
    return null;
  }

  const IconComponent = getIconComponent(name);

  if (!IconComponent) return null;

  return (
    <Suspense fallback={<Spin size="small" />}>
      <IconComponent style={style} />
    </Suspense>
  );
};
export const getFlagUrl = (countryCode: string, size: number = 40): string => {
  if (!countryCode || typeof countryCode !== "string") {
    throw new Error("Invalid country code provided.");
  }
  return `https://flagcdn.com/w${size}/${countryCode.toLowerCase()}.png`;
};
