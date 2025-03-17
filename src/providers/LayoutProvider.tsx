"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useMediaQuery } from "react-responsive";
import { LayoutContext } from "@/contexts/LayoutContext";

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [showGoTop, setShowGoTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    function handleScroll() {
      const doc = document.documentElement;
      const currentScrollY = window.scrollY || doc.scrollTop;

      const totalHeight = doc.scrollHeight - window.innerHeight;
      const progress =
        totalHeight > 0 ? (currentScrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      setShowGoTop(progress > 20);

      if (currentScrollY < window.innerHeight * 0.8) {
        document.body.classList.remove("scrolled");
      } else {
        document.body.classList.add("scrolled");
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const contextValue = useMemo(
    () => ({
      showGoTop,
      scrollProgress,
      scrollToTop,
      isMobile,
    }),
    [showGoTop, scrollProgress, scrollToTop, isMobile]
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};
