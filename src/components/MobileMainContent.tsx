"use client";

import React from "react";
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import MuxPlayer from "@mux/mux-player-react";
import { useAppContext } from "@/context/AppContext";
import { useInView } from "@/hooks/useInView";
import { usePage } from "@/hooks/usePage";
import Pagination from "./Pagination";


interface MobileMainContentProps {
  posts: SanityDocument[];
  filterState?: {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    uniqueYears: string[];
    filteredPosts: SanityDocument[];
    availableCategories: Set<string>;
  };
  viewMode?: "grid" | "list";
}

const SIZE_MULTIPLIERS: Record<string, number> = {
  small: 0.5,
  medium: 0.7,
  large: 0.9,
};

interface PostCardProps {
  post: SanityDocument & {
    playbackId?: string;
    imageUrl?: string;
    title_kr?: string;
    title_en?: string;
    category?: string[];
    publishedAt?: string;
    client?: string;
    thumbnail_size?: string;
    slug?: { current: string };
  };
  language: string;
  widthPercent?: number;
  viewMode: "grid" | "list";
  categoryColors: Record<string, string>;
}

const loadedVideos = new Set<string>();

const MobilePostCard = React.memo(
  ({
    post,
    language,
    widthPercent,
    viewMode,
    categoryColors,
  }: PostCardProps) => {
    const [cardRef, inView] = useInView();

    const alreadyLoaded = post.playbackId
      ? loadedVideos.has(post.playbackId)
      : false;
    const shouldRenderVideo = alreadyLoaded || inView;

    React.useEffect(() => {
      if (inView && post.playbackId) {
        loadedVideos.add(post.playbackId);
      }
    }, [inView, post.playbackId]);

    const muxThumbnail = post.playbackId
      ? `https://image.mux.com/${post.playbackId}/thumbnail.webp?width=480&time=0`
      : null;

    const isGrid = viewMode === "grid";

    return (
      <Link
        href={`/${post.slug?.current ?? ""}`}
        className={`flex group ${
          isGrid
            ? "flex-col group-active:brightness-75"
            : "flex-col border-b border-system-gray px-2 py-2 transition-colors active:bg-system-dark-gray/20"
        }`}
        style={
          isGrid && widthPercent
            ? {
                flex: `0 0 calc(${widthPercent}% - 0.375rem)`,
                maxWidth: `calc(${widthPercent}% - 0.375rem)`,
              }
            : undefined
        }
      >
        <div
          ref={cardRef}
          className={`${isGrid ? "w-full overflow-hidden" : "hidden invisible opacity-0 pointer-events-none"}`}
          style={{
            display: isGrid ? "block" : "none",
            visibility: isGrid ? "visible" : "hidden",
            height: isGrid ? "auto" : 0,
            width: isGrid ? "100%" : 0,
            position: isGrid ? "relative" : "absolute",
            zIndex: isGrid ? 1 : -100,
            opacity: isGrid ? 1 : 0,
            overflow: "hidden",
          }}
        >
          {post.playbackId ? (
            <div
              className="w-full relative overflow-hidden"
              style={{ display: isGrid ? "block" : "none" }}
            >
              {shouldRenderVideo ? (
                <MuxPlayer
                  playbackId={post.playbackId}
                  metadataVideoTitle={
                    language === "kr" ? post.title_kr : post.title_en
                  }
                  streamType="on-demand"
                  autoPlay="muted"
                  loop
                  muted
                  placeholder={muxThumbnail || post.imageUrl || undefined}
                  className="w-full h-auto block"
                  style={
                    {
                      "--controls": "none",
                      display: isGrid ? "block" : "none",
                    } as React.CSSProperties & Record<`--${string}`, string>
                  }
                  {...({ videoQuality: "basic" } as { videoQuality?: string })}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={muxThumbnail || post.imageUrl}
                  className="w-full h-auto object-contain"
                  alt=""
                  loading="lazy"
                  style={{ display: isGrid ? "block" : "none" }}
                />
              )}
            </div>
          ) : post.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.imageUrl}
              className="w-full h-auto object-contain"
              alt={post.title_en}
              style={{ display: isGrid ? "block" : "none" }}
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center bg-system-dark-gray/20 font-ep-sans text-size-md text-system-gray">
              No Media
            </div>
          )}
        </div>

        <div
          className={`flex ${
            isGrid
              ? "flex-col gap-2 py-2 w-full"
              : "justify-between items-start gap-4"
          }`}
        >
          <div
            className={
              !isGrid ? "flex-1 flex flex-wrap items-center gap-2" : undefined
            }
          >
            <p className="font-ep-sans leading-tight text-system-white font-medium text-size-md">
              {language === "kr" ? post.title_kr : post.title_en}
            </p>

            <div className={`flex flex-wrap gap-1 ${isGrid ? "mt-2" : ""}`}>
              {post.category?.map((category: string, index: number) => (
                <span
                  key={`${category}-${index}`}
                  className="rounded-[4px] px-[0.35rem] py-[0.15rem] font-ep-sans font-medium leading-none text-[11px] text-system-dark"
                  style={{
                    backgroundColor: categoryColors[category] || "#787878",
                  }}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {!isGrid && (
            <div className="text-right text-[11px] text-system-gray font-ep-sans whitespace-nowrap pt-0.5">
              {post.publishedAt}
            </div>
          )}
        </div>
      </Link>
    );
  },
);

MobilePostCard.displayName = "MobilePostCard";

// ... imports

export default function MobileMainContent({
  posts,
  filterState,
  viewMode = "grid",
}: MobileMainContentProps) {
  const { language, categoryColors } = useAppContext();

  const { filteredPosts } = filterState || {};

  const { currentPage, setCurrentPage, paginatedPosts, totalPages } = usePage(
    filteredPosts || posts,
  );

  // Memoize grid layout calculations
  const renderedPosts = React.useMemo(() => {
    return paginatedPosts.map((post: SanityDocument, index: number) => {
      let rawWidthPercent;
      if (viewMode === "grid") {
        const cols = 2;
        const rowStart = Math.floor(index / cols) * cols;
        const rowEnd = rowStart + cols;
        const rowSlice = paginatedPosts.slice(rowStart, rowEnd);
        const rowItemCount = rowSlice.length;

        const actualTotalM = rowSlice.reduce(
          (sum: number, p: SanityDocument) =>
            sum + (SIZE_MULTIPLIERS[p.thumbnail_size || "medium"] || 1.0),
          0,
        );

        const isLastRowShort = rowItemCount < cols;
        const paddedTotalM = isLastRowShort
          ? actualTotalM +
            (cols - rowItemCount) * (SIZE_MULTIPLIERS.medium || 0.8)
          : actualTotalM;

        const m = SIZE_MULTIPLIERS[post.thumbnail_size || "medium"] || 1.0;
        rawWidthPercent = (m / paddedTotalM) * 100;
      }

      return {
        post,
        widthPercent: rawWidthPercent,
      };
    });
  }, [paginatedPosts, viewMode]);

  return (
    <main className="px-2 wrapper-content ">
      <div className="pt-2 flex items-center justify-end text-size-sm text-system-gray font-ep-sans">
        <span>{filteredPosts?.length || 0} results</span>
      </div>

      <div
        className={`mt-3 ${
          viewMode === "grid"
            ? "flex flex-wrap gap-x-3 gap-y-6"
            : "flex flex-col border-t border-system-gray"
        }`}
      >
        {renderedPosts.map(({ post, widthPercent }) => (
          <MobilePostCard
            key={post._id}
            post={post}
            language={language}
            widthPercent={widthPercent}
            viewMode={viewMode}
            categoryColors={categoryColors}
          />
        ))}
      </div>
      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="mx-3 mt-10 mb-20"
      />
    </main>
  );
}
