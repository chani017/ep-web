"use client";

import React from "react";
import { useAppContext, type Tab } from "@/context/AppContext";
import { useRouter, usePathname } from "next/navigation";

interface MobileSidebarProps {
  children: React.ReactNode;
}

export default function MobileSidebar({ children }: MobileSidebarProps) {
  const {
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    activeTab,
    setActiveTab,
  } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-500 transition-opacity duration-200 ${
          isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />
      <div
        className={`fixed top-[35px] left-0 w-full border-b border-system-gray z-500 transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      />
      {/* 사이드패널 */}
      <div
        className={`fixed top-0 left-0 h-full w-[calc(100%-36px)] border-r border-system-gray bg-background z-500 transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 사이드패널 헤더 */}
        <div className="flex justify-between items-center px-2 h-9 border-b border-system-gray">
          {/* 탭 */}
          <div className="flex items-center gap-x-2">
            {(["Contact", "CV", "Client"] as Tab[]).map((tab) => (
              <div
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`text-size-xl font-light cursor-pointer font-ep-sans transition-colors ${
                  activeTab === tab
                    ? "text-system-white"
                    : "text-system-gray hover:text-system-white"
                }`}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>

        {/* 사이드바 콘텐츠 */}
        <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </>
  );
}
