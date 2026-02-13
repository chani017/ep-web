import { useMemo } from "react";
import { type SanityDocument } from "next-sanity";
import {
  SIZE_MULTIPLIERS,
  MOBILE_SIZE_MULTIPLIERS,
} from "@/constants/size_multipliers";

interface UsePostGridLayoutProps {
  posts: SanityDocument[];
  cols: number;
  viewMode: "desktopImg" | "list" | "mobileImg"; // "mobileImg" is for mobile, "desktopImg" is for desktop grid
  isMobile?: boolean;
}

export function usePostGridLayout({
  posts,
  cols,
  viewMode,
  isMobile = false,
}: UsePostGridLayoutProps) {
  const multipliers = isMobile ? MOBILE_SIZE_MULTIPLIERS : SIZE_MULTIPLIERS;
  const gridMode = isMobile ? "mobileImg" : "desktopImg";

  const renderedPosts = useMemo(() => {
    return posts.map((post, index) => {
      let widthPct;
      let rowItemsCount = 0;

      if (viewMode === gridMode) {
        const rowStart = Math.floor(index / cols) * cols;
        const rowEnd = Math.min(rowStart + cols, posts.length);
        const rowSlice = posts.slice(rowStart, rowEnd);
        rowItemsCount = rowSlice.length;

        const actualTotalM = rowSlice.reduce(
          (sum, p) =>
            sum +
            (multipliers[p.thumbnail_size || "medium"] ||
              (isMobile ? 1.0 : 1.0)), // Default multiplier logic might differ slightly, checking original code
          0,
        );

        // Mobile default was 1.0 for missing. Desktop was 1.0.
        // Mobile padded calculation: (cols - rowItemCount) * (SIZE_MULTIPLIERS.medium || 0.8)
        // Desktop padded calculation: (cols - rowItemCount) * SIZE_MULTIPLIERS.medium

        const mediumM = multipliers["medium"] || (isMobile ? 0.8 : 0.8);

        const isLastRowShort = rowItemsCount < cols;
        const paddedTotalM = isLastRowShort
          ? actualTotalM + (cols - rowItemsCount) * mediumM
          : actualTotalM;

        const m = multipliers[post.thumbnail_size || "medium"] || 1.0;
        widthPct = (m / paddedTotalM) * 100;
      }

      return {
        post,
        widthPct,
        rowItemsCount,
      };
    });
  }, [posts, cols, viewMode, isMobile, multipliers, gridMode]);

  return renderedPosts;
}
