"use client";

import React, { ReactNode } from "react";

interface ProtectedPageProps {
  children: ReactNode;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedPage;
