"use client";
import { FileContext } from "@/contexts/FileContext";
import { useContext } from "react";

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context)
    throw new Error("useFileContext must be used within a FileProvider");
  return context;
};
