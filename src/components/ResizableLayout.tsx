"use client";

import React, { useState, useEffect, useCallback } from "react";

interface ResizableLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function ResizableLayout({ left, right }: ResizableLayoutProps) {
  const MIN_SIDE_VW = 24;
  const MIN_MAIN_VW = 42;

  const [leftWidth, setLeftWidth] = useState(67);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e: React.PointerEvent) => {
    setIsResizing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: PointerEvent) => {
      if (isResizing) {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth >= MIN_MAIN_VW && newWidth <= 100 - MIN_SIDE_VW) {
          setLeftWidth(newWidth);
        }
      }
    },
    [isResizing],
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("pointermove", resize);
      window.addEventListener("pointerup", stopResizing);
    } else {
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stopResizing);
    }

    return () => {
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div
      className={`flex w-full h-screen overflow-hidden bg-background text-system-text font-ep-sans ${isResizing ? "select-none" : ""}`}
    >
      {/* 메인 콘텐츠 */}
      <div
        style={{ width: `${leftWidth}%` }}
        className="relative flex flex-col h-full overflow-y-auto no-scrollbar"
      >
        <div
          className={`absolute inset-0 bg-black z-100 transition-opacity duration-150 pointer-events-none ${isResizing ? "opacity-30" : "opacity-0"}`}
        />
        {left}
      </div>

      {/* 리사이즈 바 */}
      <div
        onPointerDown={startResizing}
        className="relative flex items-center justify-center cursor-col-resize z-50 group shrink-0"
      >
        <div
          className={`flex gap-1 items-center ${isResizing ? "bg-[#e2e2e2] scale-y-[1.3]" : "bg-background hover:bg-[#a4a4a4]"}`}
        >
          <div className="w-px h-screen bg-system-gray" />
          <div className="w-px h-20 bg-system-gray" />
          <div className="w-px h-screen bg-system-gray" />
        </div>
      </div>

      {/* 사이드 패널 */}
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="relative flex flex-col h-full overflow-y-auto no-scrollbar"
      >
        <div
          className={`absolute inset-0 bg-black z-100 transition-opacity duration-150 pointer-events-none ${isResizing ? "opacity-30" : "opacity-0"}`}
        />
        {right}
      </div>
    </div>
  );
}
