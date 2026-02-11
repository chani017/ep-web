"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppContext, type Tab } from "@/context/AppContext";

export default function SidebarHeader() {
  const { activeTab, setActiveTab } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <header className="flex justify-end items-center p-1 border-b border-system-gray submenu h-10 gap-x-2 px-2 bg-transparent z-40">
      {(["Contact", "CV", "Client"] as Tab[]).map((tab) => (
        <div
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`text-size-xl font-light transition-colors cursor-pointer font-ep-sans ${
            activeTab === tab && pathname === "/"
              ? "text-system-text"
              : "text-system-gray hover:text-system-text"
          }`}
        >
          {tab}
        </div>
      ))}
    </header>
  );
}
