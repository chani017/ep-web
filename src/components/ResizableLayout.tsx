"use client";

import React, { useState, useEffect, useCallback } from "react";

interface ResizableLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function ResizableLayout({ left, right }: ResizableLayoutProps) {
  const [leftWidth, setLeftWidth] = useState(73.5); // Initial width in percentage
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth >= 20 && newWidth <= 80) {
          setLeftWidth(newWidth);
        }
      }
    },
    [isResizing],
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div
      className={`flex w-full h-screen overflow-hidden bg-background text-system-text font-ep-sans ${isResizing ? "select-none" : ""}`}
    >
      {/* Left Pane */}
      <div
        style={{ width: `${leftWidth}%` }}
        className="relative flex flex-col h-full overflow-y-auto no-scrollbar"
      >
        {isResizing && (
          <div className="absolute inset-0 bg-black/30 pointer-events-none z-100" />
        )}
        {left}
      </div>

      {/* Resize Bar */}
      <div
        onMouseDown={startResizing}
        className="relative flex items-center justify-center w-3 cursor-col-resize z-50 group shrink-0 bg-background hover:bg-[rgb(164,164,164)]"
      >
        <div className="flex gap-1 items-center">
          <div className="w-[1px] h-screen bg-system-gray" />
          <div className="w-[1px] h-10 bg-system-gray group-hover:scale-y-[1.3]" />
          <div className="w-[1px] h-screen bg-system-gray" />
        </div>
      </div>

      {/* Right Pane */}
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="relative flex flex-col h-full overflow-y-auto no-scrollbar"
      >
        {isResizing && (
          <div className="absolute inset-0 bg-black/30 pointer-events-none z-100" />
        )}
        {right}
      </div>
    </div>
  );
}
