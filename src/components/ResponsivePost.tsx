"use client";

import React from "react";
import { type SanityDocument } from "next-sanity";
import { useAppContext } from "@/context/AppContext";
import DesktopPostContent from "./DesktopPostContent";
import MobilePostContent from "./MobilePostContent";

interface ResponsivePostProps {
  post: SanityDocument;
}

export default function ResponsivePost({ post }: ResponsivePostProps) {
  const { isMobile } = useAppContext();

  if (isMobile) {
    return <MobilePostContent post={post} />;
  }

  return <DesktopPostContent post={post} />;
}
