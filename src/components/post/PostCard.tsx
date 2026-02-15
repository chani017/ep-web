"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { type SanityDocument } from "next-sanity";
import MuxPlayer from "@mux/mux-player-react";
import { useInView } from "@/hooks/useInView";
import { CATEGORY_COLORS } from "@/constants/common";

interface PostCardProps {
  post: SanityDocument;
  language: string;
  viewMode: "desktopImg" | "list" | "mobileImg";
  cols?: number;
  rowItemsCount?: number;
  widthPct?: number;
  isMobile?: boolean;
  searchTerm?: string;
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
    isMobile = false,
    searchTerm,
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

    // Mux 비디오 썸네일 생성
    const muxThumbnail = post.playbackId
      ? `https://image.mux.com/${post.playbackId}/thumbnail.webp?width=480&time=0`
      : null;

    // viewMode: 데스크탑은 "desktopImg", 모바일은 "mobileImg"
    const isList = viewMode === "list";
    const isGrid = !isList;

    // 컨테이너 (Link) 클래스
    const getContainerClasses = () => {
      if (isMobile) {
        return `flex group ${
          isGrid
            ? "flex-col group-active:brightness-75"
            : "flex-col border-b border-system-gray px-2 py-2 transition-colors active:bg-system-dark-gray/20"
        }`;
      } else {
        // 데스크탑
        return `group ${
          isList
            ? "col-span-4 grid grid-cols-4 border-b border-system-gray min-h-10 hover:bg-system-dark-gray transition-colors items-start px-1 py-2 gap-x-3"
            : "flex flex-col"
        }`;
      }
    };

    // 컨테이너 스타일
    const getContainerStyle = () => {
      if (!isGrid || !widthPct) return undefined;

      const gapRem = 0.375;

      // 모바일
      if (isMobile) {
        return {
          flex: `0 0 calc(${widthPct}% - ${gapRem}rem)`,
          maxWidth: `calc(${widthPct}% - ${gapRem}rem)`,
        };
      }

      // 데스크탑
      if (rowItemsCount) {
        const gapOffset = (widthPct * (rowItemsCount - 1) * 0.5) / 100;

        return {
          flex: `0 0 calc(${widthPct}% - ${gapOffset}rem)`,
        };
      }

      return undefined;
    };

    const getMediaContainerClasses = () => {
      if (isMobile) {
        return `${isGrid ? "w-full overflow-hidden relative" : "hidden"}`;
      } else {
        return "flex flex-col w-full transition-all duration-150 group-hover:brightness-60";
      }
    };

    const getMediaStyle = () => {
      if (!isMobile) {
        return { display: isList ? "none" : "flex" };
      }
      return undefined;
    };

    return (
      <Link
        href={`/${post.slug?.current || ""}`}
        className={getContainerClasses()}
        style={getContainerStyle()}
      >
        <div className={getMediaContainerClasses()} style={getMediaStyle()}>
          <div ref={cardRef} className="w-full overflow-hidden relative">
            {post.playbackId ? (
              <div className="w-full relative overflow-hidden">
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
                        display: "block",
                      } as React.CSSProperties & Record<`--${string}`, string>
                    }
                    {...({ videoQuality: "basic" } as {
                      videoQuality?: string;
                    })}
                  />
                ) : (
                  <Image
                    src={muxThumbnail || post.imageUrl}
                    className="w-full h-auto object-contain"
                    alt={
                      language === "kr"
                        ? ((post.title_kr as string) ?? "")
                        : ((post.title_en as string) ?? "")
                    }
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                  />
                )}
              </div>
            ) : post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={
                  language === "kr"
                    ? ((post.title_kr as string) ?? "")
                    : ((post.title_en as string) ?? "")
                }
                className="w-full h-auto object-contain"
                width={0}
                height={0}
                sizes="100vw"
              />
            ) : (
              <div
                className={`flex w-full aspect-square items-center justify-center bg-system-dark-gray/20 font-ep-sans text-system-gray ${
                  isMobile ? "text-size-md" : "text-size-sm"
                }`}
              >
                No Media
              </div>
            )}
          </div>

          {/* 미디어 하단 콘텐츠 (그리드 뷰) */}
          <div
            className={`flex ${
              isMobile
                ? "flex-col py-2 w-full"
                : "flex-col gap-2 pt-2 w-full min-h-18"
            }`}
          >
            {isMobile && !isGrid ? null : (
              // 그리드 뷰 콘텐츠 (데스크탑 & 모바일)
              <>
                <p className="text-system-white text-size-sm font-medium font-ep-sans leading-tight line-clamp-2">
                  {language === "kr" ? post.title_kr : post.title_en}
                </p>
                <div
                  className={`flex flex-wrap gap-1 ${isMobile && isGrid ? "mt-2" : ""}`}
                >
                  {post.category?.map((category: string, index: number) => (
                    <span
                      key={`${category}-${index}`}
                      className="px-[0.35rem] py-[0.15rem] rounded-[4px] text-[11px] leading-none font-medium font-ep-sans text-system-dark"
                      style={{
                        backgroundColor: CATEGORY_COLORS[category] || "#787878",
                      }}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 리스트 뷰 콘텐츠 */}
        {/* 데스크탑 리스트 뷰 */}
        {!isMobile && isList && (
          <>
            <div className="col-span-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-size-md text-system-white font-ep-sans">
              <span>{language === "kr" ? post.title_kr : post.title_en}</span>
              <div className="flex gap-1 shrink-0">
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
            <div className="col-span-1 text-size-md text-system-white font-ep-sans uppercase">
              {post.publishedAt}
            </div>
            <div
              className={`col-span-1 text-size-md font-ep-sans uppercase text-left ${
                searchTerm && post.client === searchTerm
                  ? "text-system-gray"
                  : "text-system-white"
              }`}
            >
              {post.client || ""}
            </div>
          </>
        )}

        {/* 모바일 리스트 뷰 */}
        {isMobile && !isGrid && (
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <p className="font-ep-sans leading-tight text-system-white font-medium text-size-md">
                {language === "kr" ? post.title_kr : post.title_en}
              </p>
              <div className="flex flex-wrap gap-1">
                {post.category?.map((category: string, index: number) => (
                  <span
                    key={`${category}-${index}`}
                    className="rounded-[4px] px-[0.35rem] py-[0.15rem] font-ep-sans font-medium leading-none text-[11px] text-system-dark"
                    style={{
                      backgroundColor: CATEGORY_COLORS[category] || "#787878",
                    }}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right text-[11px] text-system-gray font-ep-sans whitespace-nowrap pt-0.5">
              {post.publishedAt}
            </div>
          </div>
        )}
      </Link>
    );
  },
);

PostCard.displayName = "PostCard";

export default PostCard;
