"use client";

import React from "react";
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import MuxPlayer from "@mux/mux-player-react";
import { useAppContext } from "@/context/AppContext";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import { useInView } from "@/hooks/useInView";
import { usePage } from "@/hooks/usePage";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const CATEGORY_COLORS: Record<string, string> = {
  Graphic: "#42ff00",
  Identity: "#FFEB23",
  Website: "#92FFF8",
  Editorial: "#D8BAFF",
  Motion: "#7572d5",
  Space: "#d089c0",
};

interface MobileMainContentProps {
  posts: SanityDocument[];
  filterState?: any;
  viewMode?: "grid" | "list";
}

const SIZE_MULTIPLIERS: Record<string, number> = {
  small: 0.5,
  medium: 0.7,
  large: 0.9,
};

interface PostCardProps {
  post: any;
  language: string;
  widthPercent?: number;
  viewMode: "grid" | "list";
}

const loadedVideos = new Set<string>();

const MobilePostCard = React.memo(
  ({ post, language, widthPercent, viewMode }: PostCardProps) => {
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
        href={`/${post.slug.current}`}
        className={`group flex ${
          isGrid
            ? "flex-col group-active:brightness-75"
            : "flex-col py-2 px-2 border-b border-system-gray active:bg-system-dark-gray/20 transition-colors"
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
                    } as any
                  }
                  {...({ videoQuality: "basic" } as any)}
                />
              ) : (
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
            <img
              src={post.imageUrl}
              className="w-full h-auto object-contain"
              alt={post.title_en}
              style={{ display: isGrid ? "block" : "none" }}
            />
          ) : (
            <div className="w-full aspect-square flex items-center justify-center text-system-gray text-size-md font-ep-sans bg-system-dark-gray/20">
              No Media
            </div>
          )}
        </div>

        {/* 콘텐츠 블럭 */}
        <div
          className={`${
            isGrid
              ? "flex flex-col gap-2 py-2 w-full"
              : "flex justify-between items-start gap-4"
          }`}
        >
          <div
            className={`${isGrid ? "" : "flex-1 flex flex-wrap items-center gap-2"}`}
          >
            <p
              className={`text-system-white font-ep-sans leading-tight mb-2 ${
                isGrid ? "text-size-md font-medium" : "text-size-md font-medium"
              }`}
            >
              {language === "kr" ? post.title_kr : post.title_en}
            </p>
            <div className="flex flex-wrap gap-1">
              {post.category?.map((category: string) => (
                <span
                  key={category}
                  className="px-[0.35rem] py-[0.15rem] rounded-[4px] text-[11px] leading-none font-medium font-ep-sans text-system-dark"
                  style={{
                    backgroundColor: CATEGORY_COLORS[category] || "#787878",
                  }}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* 메타데이터 블럭 */}
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

export default function MobileMainContent({
  posts,
  filterState,
  viewMode = "grid",
}: MobileMainContentProps) {
  const { language } = useAppContext();

  const { filteredPosts } = filterState || {};

  const { currentPage, setCurrentPage, paginatedPosts, totalPages } = usePage(
    filteredPosts || posts,
  );

  return (
    <main className="px-1.5 wrapper-content ">
      <div className="pt-2 flex items-center justify-end text-size-sm text-system-gray font-ep-sans">
        <span>{filteredPosts?.length || 0} results</span>
      </div>

      <div
        className={`mt-3 ${
          viewMode === "grid"
            ? "flex flex-wrap gap-x-3 gap-y-8 px-2"
            : "flex flex-col border-t border-system-gray"
        }`}
      >
        {paginatedPosts.map((post: any, index: number) => {
          let rawWidthPercent;
          if (viewMode === "grid") {
            const cols = 2;
            const rowStart = Math.floor(index / cols) * cols;
            const rowEnd = rowStart + cols;
            const rowSlice = paginatedPosts.slice(rowStart, rowEnd);
            const rowItemCount = rowSlice.length;

            const actualTotalM = rowSlice.reduce(
              (sum: number, p: any) =>
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

          return (
            <MobilePostCard
              key={post._id}
              post={post}
              language={language}
              widthPercent={rawWidthPercent}
              viewMode={viewMode}
            />
          );
        })}
      </div>
      {/* 페이지네이션 (PC와 동일한 디자인) */}
      {totalPages >= 1 && (
        <div className="px-3 pt-4 pb-10 flex justify-start items-center text-size-md gap-1">
          {currentPage > 1 && (
            <button
              onClick={() => {
                setCurrentPage(currentPage - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="font-ep-sans text-system-white text-size-md hover:bg-system-dark-gray px-1.5 leading-5 rounded-md min-w-3 text-center"
            >
              〈
            </button>
          )}
          {Array.from({ length: totalPages }).map((_, i) => (
            <React.Fragment key={i + 1}>
              <button
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`font-ep-sans transition-colors cursor-pointer px-1.5 leading-5 rounded-md min-w-5 text-center ${
                  currentPage === i + 1
                    ? "text-system-white bg-transparent hover:bg-system-dark-gray"
                    : "text-system-white bg-[#464646] hover:bg-system-dark-gray"
                }`}
              >
                {i + 1}
              </button>
            </React.Fragment>
          ))}
          {currentPage < totalPages && (
            <button
              onClick={() => {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="font-ep-gothic text-system-white text-size-md hover:bg-system-dark-gray px-1.5 leading-5 rounded-md min-w-3 text-center"
            >
              〉
            </button>
          )}
        </div>
      )}
    </main>
  );
}
