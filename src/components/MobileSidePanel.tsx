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
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 bg-black/50 z-500 transition-opacity duration-300 ${
          isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* 사이드바 패널 */}
      <div
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[360px] bg-background z-999 transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 사이드바 헤더 */}
        <div className="flex justify-between items-center px-3 h-12 border-b border-system-gray">
          {/* 탭 */}
          <div className="flex items-center gap-x-3">
            {(["Contact", "CV", "Client"] as Tab[]).map((tab) => (
              <div
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`text-size-xl font-light cursor-pointer font-ep-sans transition-colors ${
                  activeTab === tab
                    ? "text-system-text"
                    : "text-system-gray hover:text-system-text"
                }`}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-system-text cursor-pointer"
            aria-label="메뉴 닫기"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="1" y1="1" x2="17" y2="17" />
              <line x1="17" y1="1" x2="1" y2="17" />
            </svg>
          </button>
        </div>

        {/* 사이드바 콘텐츠 */}
        <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </>
  );
}
