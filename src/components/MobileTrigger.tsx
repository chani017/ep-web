"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter, usePathname } from "next/navigation";

export default function MobileTrigger() {
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const isPostPage = pathname !== "/";

  const handleClick = () => {
    if (isPostPage) {
      router.push("/");
    } else if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    } else {
      setIsMobileSidebarOpen(true);
    }
  };

  const isRotated = isPostPage || isMobileSidebarOpen;

  return (
    <button
      onClick={handleClick}
      className="fixed right-0 w-10 h-10 flex flex-col justify-center items-center cursor-pointer z-1000"
    >
      <img
        src="/plus.svg"
        alt="Menu"
        className={`w-5 h-5 transition-transform duration-200 ${isRotated ? "rotate-135" : ""}`}
        style={{ display: "block" }}
      />
    </button>
  );
}
