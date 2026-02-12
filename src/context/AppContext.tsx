"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { type SanityDocument } from "next-sanity";

type Language = "kr" | "en";
export type Tab = "Contact" | "CV" | "Client";

const MOBILE_BREAKPOINT = 1194;

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isFullContentMode: boolean;
  setIsFullContentMode: (mode: boolean) => void;
  currentPost: SanityDocument | null;
  setCurrentPost: (post: SanityDocument | null) => void;
  isMobile: boolean;
  isMounted: boolean;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("kr");
  const [activeTab, setActiveTab] = useState<Tab>("Contact");
  const [isFullContentMode, setIsFullContentMode] = useState(false);
  const [currentPost, setCurrentPost] = useState<SanityDocument | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isMobile) setIsMobileSidebarOpen(false);
  }, [isMobile]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        isFullContentMode,
        setIsFullContentMode,
        currentPost,
        setCurrentPost,
        isMobile,
        isMounted,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
