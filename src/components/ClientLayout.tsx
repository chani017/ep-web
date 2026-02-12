"use client";

import React from "react";
import { type SanityDocument } from "next-sanity";
import { useAppContext } from "@/context/AppContext";
import { usePostFilter } from "@/hooks/usePostFilter";
import MobileMainContent from "./MobileMainContent";
import ResizableLayout from "./ResizableLayout";
import MainContent from "./MainContent";
import SidePanelHeader from "./SidePanelHeader";
import MobileHeader from "./MobileHeader";
import MobileSidebar from "./MobileSidePanel";

interface ClientLayoutProps {
  posts: SanityDocument[];
  children: React.ReactNode;
}

export default function ClientLayout({ posts, children }: ClientLayoutProps) {
  const { isMobile } = useAppContext();
  const filterState = usePostFilter(posts);
  const [mobileViewMode, setMobileViewMode] = React.useState<"grid" | "list">(
    "grid",
  );

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-background text-system-text font-ep-sans">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <MobileHeader
            filterState={filterState}
            viewMode={mobileViewMode}
            setViewMode={setMobileViewMode}
          />
          <MobileMainContent
            posts={posts}
            filterState={filterState}
            viewMode={mobileViewMode}
          />
        </div>
        <MobileSidebar>{children}</MobileSidebar>
      </div>
    );
  }

  return (
    <ResizableLayout
      left={<MainContent posts={posts} filterState={filterState} />}
      right={
        <div className="flex flex-col h-full overflow-hidden">
          <SidePanelHeader />
          <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
        </div>
      }
    />
  );
}
