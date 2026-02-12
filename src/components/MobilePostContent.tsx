"use client";

import React from "react";
import { PortableText, type SanityDocument } from "next-sanity";
import MuxPlayer from "@mux/mux-player-react";
import { useAppContext } from "@/context/AppContext";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";

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

interface MobilePostContentProps {
  post: SanityDocument;
}

export default function MobilePostContent({ post }: MobilePostContentProps) {
  const { language } = useAppContext();

  const description =
    language === "kr" ? post.description_kr : post.description_en;
  const media = post.media || [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-system-text pb-20">
      <div className="px-4 py-6 border-b border-system-gray">
        <h1 className="text-[1.8rem] font-medium font-ep-sans leading-tight mb-3">
          {language === "kr" ? post.title_kr : post.title_en}
        </h1>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-size-sm text-system-gray font-ep-sans">
            {post.publishedAt}
          </span>
          {post.category?.map((category: string) => (
            <span
              key={category}
              className="px-2 py-0.5 rounded-[4px] text-[11px] font-medium font-ep-sans text-[#131313]"
              style={{
                backgroundColor: CATEGORY_COLORS[category] || "#787878",
              }}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="text-size-md font-ep-sans leading-relaxed text-system-text/90">
          {Array.isArray(description) && (
            <PortableText
              value={description}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p className="mb-4 last:mb-0">{children}</p>
                  ),
                },
              }}
            />
          )}
          {post.additional_link && (
            <div className="mt-4">
              <a
                href={post.additional_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-system-text hover:opacity-70 transition-opacity"
              >
                <img src="/plus.svg" alt="" className="w-3 h-3" />
                <span className="underline underline-offset-2">
                  {post.additional_link}
                </span>
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {media.map((item: any, index: number) => {
          if (item._type === "image") {
            const imgUrl = urlFor(item)?.url();
            return (
              <figure key={item._key || index} className="w-full">
                {imgUrl && (
                  <img
                    src={imgUrl}
                    alt={item.caption || ""}
                    className="w-full h-auto rounded-sm"
                  />
                )}
                {item.caption && (
                  <figcaption className="text-left text-xs text-system-gray mt-2 font-ep-sans">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            );
          }
          if (item._type === "mux.video") {
            const playbackId = item.asset?.playbackId;
            if (!playbackId) return null;
            return (
              <div
                key={item._key || index}
                className="w-full rounded-sm overflow-hidden"
              >
                <MuxPlayer
                  playbackId={playbackId}
                  streamType="on-demand"
                  autoPlay="muted"
                  loop
                  muted
                  style={{ width: "100%", aspectRatio: "16/9" }}
                  className="w-full h-auto block"
                />
              </div>
            );
          }
          if (item._type === "youtube") {
            const videoId = item.url?.match(
              /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
            )?.[1];
            if (!videoId) return null;

            return (
              <div
                key={item._key || index}
                className="w-full aspect-video rounded-sm overflow-hidden"
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
