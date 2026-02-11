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

const TAG_COLORS: Record<string, string> = {
  Graphic: "#42ff00",
  Identity: "#FFEB23",
  Website: "#92FFF8",
  Editorial: "#D8BAFF",
  Motion: "#7572d5",
  Space: "#d089c0",
};

interface PostContentProps {
  post: SanityDocument;
}

export default function PostContent({ post }: PostContentProps) {
  const { language } = useAppContext();
  const description = language === "kr" ? post.description_kr : post.description_en;
  const media = post.media || [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 flex flex-col h-full overflow-y-auto no-scrollbar gap-4">
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-2xl font-normal text-system-text font-ep-sans leading-tight max-w-[75%]">
            {language === "kr" ? post.title_kr : post.title_en}
          </h1>
          <div className="flex items-start gap-1.5 shrink-0">
            <span className="text-size-md text-system-text font-ep-sans">
              {post.publishedAt?.toString()}
            </span>
            <div className="flex flex-col items-end gap-1 mt-1">
              {post.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="px-[0.4rem] py-[0.2rem] rounded-[5px] text-[11px] leading-none font-medium font-ep-sans text-[#131313] whitespace-nowrap"
                  style={{
                    backgroundColor: TAG_COLORS[tag] || "#787878",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 mt-4">
          {media.map((item: any, index: number) => {
            if (item._type === "image") {
              const imgUrl = urlFor(item)?.url();
              return (
                <figure key={item._key || index} className="w-full">
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={item.caption || ""}
                      className="w-full h-auto object-contain rounded-sm"
                    />
                  )}
                  {item.caption && (
                    <figcaption className="text-left text-[10px] text-system-gray mt-1 font-ep-sans">
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
                <div key={item._key || index} className="w-full rounded-sm overflow-hidden border border-system-gray/30">
                  <MuxPlayer
                    playbackId={playbackId}
                    streamType="on-demand"
                    autoPlay="muted"
                    loop
                    muted
                    style={{ width: "100%", aspectRatio: "16/9" }}
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
                  className="w-full overflow-hidden"
                  style={{ aspectRatio: "1/1" }}
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
        <div className="prose prose-invert max-w-none text-size-md font-ep-sans text-system-text">
          {Array.isArray(description) && (
            <PortableText value={description} />
          )}
        </div>
      </div>
    </div>
  );
}
