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

interface MobilePostContentProps {
  post: SanityDocument;
}

export default function MobilePostContent({ post }: MobilePostContentProps) {
  const { language, categoryColors } = useAppContext();

  const description =
    language === "kr" ? post.description_kr : post.description_en;
  const media = post.media || [];

  return (
    <div className="h-full w-full overflow-y-auto bg-background no-scrollbar">
      <div className="flex min-h-screen flex-col bg-background pb-5 text-system-white">
        <div className="px-2 pb-2 flex justify-between items-start">
          <h1 className="mt-2 font-ep-sans font-normal leading-none text-size-xl">
            {language === "kr" ? post.title_kr : post.title_en}
          </h1>
          <div className="flex items-start gap-x-2 mt-2">
            <span className="text-[0.875rem] text-system-white font-normal font-ep-sans leading-none">
              {post.publishedAt}
            </span>
            <div className="flex flex-col gap-0.5 items-end">
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

        <div className="flex flex-col gap-2 px-2 mb-5">
          {media.map((item: { _type: string; _key?: string; caption?: string; asset?: { playbackId?: string }; image?: { asset?: { _ref?: string } }; url?: string; [key: string]: unknown }, index: number) => {
            if (item._type === "image") {
              const imgUrl = urlFor(item)?.url();
              return (
                <figure key={item._key || index} className="w-full">
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={item.caption || ""}
                      className="w-full h-auto"
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
                  className="w-full overflow-hidden"
                >
                  <MuxPlayer
                    playbackId={playbackId}
                    streamType="on-demand"
                    autoPlay="muted"
                    loop
                    muted
                    style={{ width: "100%", aspectRatio: "1/1" }}
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
        <div className="mx-2 break-keep font-ep-sans font-medium leading-relaxed text-[0.875rem] text-system-white">
          {Array.isArray(description) && (
            <PortableText
              value={description}
              components={{
                block: {
                  normal: ({ children }) => <p className="mb-2">{children}</p>,
                },
              }}
            />
          )}
          {post.additional_link && (
            <div className="mt-2 flex flex-col gap-1">
              {Array.isArray(post.additional_link) ? (
                post.additional_link.map((link: string, index: number) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-system-white hover:opacity-70 transition-opacity"
                  >
                    <img src="/plus.svg" alt="" className="w-3 h-3" />
                    <span>{link}</span>
                  </a>
                ))
              ) : (
                <a
                  href={post.additional_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-system-white hover:opacity-70 transition-opacity"
                >
                  <img src="/plus.svg" alt="" className="w-3 h-3" />
                  <span>{post.additional_link}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
