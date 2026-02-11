"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "kr" | "en";
export type Tab = "Contact" | "CV" | "Client";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("kr");
  const [activeTab, setActiveTab] = useState<Tab>("Contact");

  return (
    <AppContext.Provider value={{ language, setLanguage, activeTab, setActiveTab }}>
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
