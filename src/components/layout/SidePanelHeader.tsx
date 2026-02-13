"use client";

import Image from "next/image";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppContext, type Tab } from "@/context/AppContext";

export default function SidebarHeader() {
  const { activeTab, setActiveTab, isFullContentMode, setIsFullContentMode } =
    useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  const isPostPage = pathname !== "/" && pathname !== "" && pathname !== null;

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <header className="flex justify-end items-center p-1 border-b border-system-gray submenu h-10 gap-x-2 px-2 bg-transparent z-40 relative">
      {isPostPage && (
        <button
          onClick={() => setIsFullContentMode(!isFullContentMode)}
          className="absolute left-2"
        >
          <Image
            src={
              isFullContentMode
                ? "/full-button_contract.svg"
                : "/full-button_expand.svg"
            }
            alt="Toggle Full Mode"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
      )}
      {(["Contact", "CV", "Client"] as Tab[]).map((tab) => (
        <div
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`text-size-xl font-light transition-colors cursor-pointer font-ep-sans ${
            activeTab === tab && pathname === "/"
              ? "text-system-white"
              : "text-system-gray hover:text-system-white"
          }`}
        >
          {tab}
        </div>
      ))}
    </header>
  );
}
