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
import MobileTrigger from "./MobileTrigger";
import { usePathname } from "next/navigation";

interface ClientLayoutProps {
  posts: SanityDocument[];
  children: React.ReactNode;
}

export default function ClientLayout({ posts, children }: ClientLayoutProps) {
  const { isMobile, isMounted } = useAppContext();
  const filterState = usePostFilter(posts);
  const pathname = usePathname();
  const [mobileViewMode, setMobileViewMode] = React.useState<"grid" | "list">(
    "grid",
  );

  const [activePostContent, setActivePostContent] =
    React.useState<React.ReactNode>(null);

  const isPostPage = pathname !== "/";

  React.useEffect(() => {
    if (isMobile && isPostPage) {
      setActivePostContent(children);
    }
  }, [isMobile, isPostPage, children]);

  if (!isMounted) {
    return <div className="h-screen w-screen bg-background" />;
  }

  if (isMobile) {
    {
      /* 반응형 구현 (Mobile) */
    }
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-background font-ep-sans text-system-white">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <MobileHeader
            filterState={filterState}
            viewMode={mobileViewMode}
            setViewMode={setMobileViewMode}
            isPostPage={isPostPage}
          />
          <MobileMainContent
            posts={posts}
            filterState={filterState}
            viewMode={mobileViewMode}
          />
        </div>

        {!isPostPage && <MobileSidebar>{children}</MobileSidebar>}

        <div
          className={`fixed inset-x-0 bottom-0 top-10 z-80 bg-background transition-transform duration-200 ease-in-out ${
            isPostPage ? "translate-y-0" : "translate-y-full"
          }`}
          onTransitionEnd={() => {
            if (!isPostPage) setActivePostContent(null);
          }}
        >
          {activePostContent}
        </div>

        <MobileTrigger />
      </div>
    );
  }

  return (
    <ResizableLayout
      left={<MainContent posts={posts} filterState={filterState} />}
      right={
        <div className="flex h-full flex-col overflow-hidden">
          <SidePanelHeader />
          <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
        </div>
      }
    />
  );
}
