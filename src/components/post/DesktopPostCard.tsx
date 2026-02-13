"use client";

import React from "react";
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import MuxPlayer from "@mux/mux-player-react";
import { useInView } from "@/hooks/useInView";

interface PostCardProps {
  post: SanityDocument;
  language: string;
  viewMode: "img" | "list";
  cols: number;
  rowItemsCount: number;
  widthPct?: number;
  categoryColors: Record<string, string>;
}

const loadedVideos = new Set<string>();

const PostCard = React.memo(
  ({
    post,
    language,
    viewMode,
    rowItemsCount,
    cols,
    widthPct,
    categoryColors,
  }: PostCardProps) => {
    void cols;
    const alreadyLoaded = post.playbackId
      ? loadedVideos.has(post.playbackId)
      : false;

    const [cardRef, inView] = useInView();
    const shouldRenderVideo = alreadyLoaded || inView;

    React.useEffect(() => {
      if (inView && post.playbackId) {
        loadedVideos.add(post.playbackId);
      }
    }, [inView, post.playbackId]);

    // Mux 비디오 썸네일 URL 생성
    const muxThumbnail = post.playbackId
      ? `https://image.mux.com/${post.playbackId}/thumbnail.webp?width=480&time=0`
      : null;

    const isList = viewMode === "list";

    return (
      <Link
        href={`/${post.slug?.current || ""}`}
        className={`group ${
          isList
            ? "col-span-4 grid grid-cols-4 border-b border-system-gray min-h-10 hover:bg-system-dark-gray transition-colors items-start px-1 py-2 gap-x-3"
            : "flex flex-col"
        }`}
        style={
          !isList && widthPct
            ? {
                flex: `0 0 calc(${widthPct}% - ${(widthPct * (rowItemsCount - 1) * 0.5) / 100}rem)`,
              }
            : undefined
        }
      >
        <div
          className="flex flex-col w-full transition-all duration-150 group-hover:brightness-60"
          style={{ display: isList ? "none" : "flex" }}
        >
          <div ref={cardRef} className="w-full overflow-hidden">
            {post.playbackId ? (
              <div className="w-full relative overflow-hidden">
                {shouldRenderVideo ? (
                  <>
                    {/* 비디오 플레이어 (Lazy Load) */}
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
                          display: "block",
                        } as React.CSSProperties & Record<`--${string}`, string>
                      }
                    />
                  </>
                ) : (
                  <img
                    src={muxThumbnail || post.imageUrl}
                    className="w-full h-auto object-contain"
                    alt={
                      language === "kr"
                        ? ((post.title_kr as string) ?? "")
                        : ((post.title_en as string) ?? "")
                    }
                    loading="lazy"
                  />
                )}
              </div>
            ) : post.imageUrl ? (
              <>
                {/* 일반 이미지 썸네일 */}
                <img
                  src={post.imageUrl}
                  alt={
                    language === "kr"
                      ? ((post.title_kr as string) ?? "")
                      : ((post.title_en as string) ?? "")
                  }
                  className="w-full h-auto object-contain"
                />
              </>
            ) : (
              <div className="w-full aspect-square flex items-center justify-center text-system-gray text-size-sm font-ep-sans">
                No Media
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 pt-2 w-full min-h-18">
            {/* 포스트 제목 */}
            <p className="text-system-white text-size-md font-medium font-ep-sans leading-tight line-clamp-2">
              {language === "kr" ? post.title_kr : post.title_en}
            </p>
            {/* 카테고리 태그 리스트 */}
            <div className="flex flex-wrap gap-1">
              {post.category?.map((category: string) => (
                <span
                  key={category}
                  className="px-[0.35rem] py-[0.15rem] rounded-[4px] text-[11px] leading-none font-medium font-ep-sans text-system-dark"
                  style={{
                    backgroundColor: categoryColors[category] || "#787878",
                  }}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {isList && (
          <>
            <div className="col-span-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-size-md text-system-white font-ep-sans">
              <span>{language === "kr" ? post.title_kr : post.title_en}</span>
              <div className="flex gap-1 shrink-0">
                {post.category?.map((category: string) => (
                  <span
                    key={category}
                    className="px-[0.35rem] py-[0.15rem] rounded-[4px] text-[11px] leading-none font-medium font-ep-sans text-system-dark"
                    style={{
                      backgroundColor: categoryColors[category] || "#787878",
                    }}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-span-1 text-size-md text-system-white font-ep-sans uppercase">
              {post.publishedAt}
            </div>
            <div className="col-span-1 text-size-md text-system-white font-ep-sans uppercase text-left">
              {post.client || ""}
            </div>
          </>
        )}
      </Link>
    );
  },
);

PostCard.displayName = "PostCard";

export default PostCard;
