"use client";

import { createContext, useContext } from "react";

interface LayoutContextProps {
  showGoTop: boolean;
  scrollProgress: number;
  scrollToTop: () => void;
  isMobile: boolean;
}

export const LayoutContext = createContext<LayoutContextProps | undefined>(
  undefined
);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
