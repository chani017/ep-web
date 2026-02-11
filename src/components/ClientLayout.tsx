"use client";

import React from "react";
import { type SanityDocument } from "next-sanity";
import ResizableLayout from "./ResizableLayout";
import MainContent from "./MainContent";
import SidePanelHeader from "./SidePanelHeader";

interface ClientLayoutProps {
  posts: SanityDocument[];
  children: React.ReactNode;
}

export default function ClientLayout({ posts, children }: ClientLayoutProps) {
  return (
    <ResizableLayout
      left={<MainContent posts={posts} />}
      right={
        <div className="flex flex-col h-full overflow-hidden">
          <SidePanelHeader />
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {children}
          </div>
        </div>
      }
    />
  );
}
