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

const CATEGORY_COLORS: Record<string, string> = {
  Graphic: "#42ff00",
  Identity: "#FFEB23",
  Website: "#7CEEFF",
  Editorial: "#D8BAFF",
  Motion: "#8683FF",
  Space: "#FF99E2",
  Practice: "#FF590C",
  Press: "#6A6A6A",
  Everyday: "#FF9999",
};

const CATEGORIES = [
  "All Types",
  "Graphic",
  "Editorial",
  "Website",
  "Identity",
  "Space",
  "Practice",
  "Motion",
  "Press",
  "Everyday",
];

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
  categoryColors: Record<string, string>;
  categories: string[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
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
  const [searchTerm, setSearchTerm] = useState("");

  const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
      check();
    });
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isMobile) queueMicrotask(() => setIsMobileSidebarOpen(false));
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
        categoryColors: CATEGORY_COLORS,
        categories: CATEGORIES,
        searchTerm,
        setSearchTerm,
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
