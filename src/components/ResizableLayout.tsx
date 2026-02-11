"use client";

import React, { useState, useEffect, useCallback } from "react";

interface ResizableLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function ResizableLayout({ left, right }: ResizableLayoutProps) {
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
        if (newWidth >= 45 && newWidth <= 73) {
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
        {isResizing && (
          <div className="absolute inset-0 bg-black/10 z-100" />
        )}
        {left}
      </div>

      {/* 리사이즈 바 */}
      <div
        onPointerDown={startResizing}
        className="relative flex items-center justify-center w-3 cursor-col-resize z-50 group shrink-0 bg-background hover:bg-[rgb(164,164,164)]"
      >
        <div className="flex gap-1 items-center">
          <div className="w-[1px] h-screen bg-system-gray" />
          <div className="w-[1px] h-20 bg-system-gray group-hover:scale-y-[1.3]" />
          <div className="w-[1px] h-screen bg-system-gray" />
        </div>
      </div>

      {/* 사이드 패널 */}
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="relative flex flex-col h-full overflow-y-auto no-scrollbar"
      >
        {isResizing && (
          <div className="absolute inset-0 bg-black/10 z-100" />
        )}
        {right}
      </div>
    </div>
  );
}
