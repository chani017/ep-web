"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { type SanityDocument } from "next-sanity";
import MuxPlayer from "@mux/mux-player-react";
import { useInView } from "@/hooks/useInView";

interface PostCardProps {
  post: SanityDocument;
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
          className={`${isGrid ? "w-full overflow-hidden relative" : "hidden"}`}
        >
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
                    } as React.CSSProperties & Record<`--${string}`, string>
                  }
                  {...({ videoQuality: "basic" } as { videoQuality?: string })}
                />
              ) : (
                <Image
                  src={muxThumbnail || post.imageUrl}
                  className="w-full h-auto object-contain"
                  alt=""
                  loading="lazy"
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              )}
            </div>
          ) : post.imageUrl ? (
            <Image
              src={post.imageUrl}
              className="w-full h-auto object-contain"
              alt={post.title_en}
              width={0}
              height={0}
              sizes="100vw"
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

export default MobilePostCard;
