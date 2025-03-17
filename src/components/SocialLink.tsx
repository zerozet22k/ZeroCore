// components/SocialLink.tsx
import { Button } from "antd";
import Link from "next/link";
import { ReactNode } from "react";

interface SocialLinkProps {
  url: string;
  icon: ReactNode;
}

const SocialLink: React.FC<SocialLinkProps> = ({ url, icon }) => {
  if (!url) return null;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ margin: "0 2px" }}
    >
      <Button icon={icon} type="dashed" />
    </Link>
  );
};

export default SocialLink;
