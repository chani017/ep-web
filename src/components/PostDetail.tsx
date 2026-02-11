"use client";

import React from "react";
import { PortableText, type SanityDocument } from "next-sanity";
import Link from "next/link";
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

interface PostDetailProps {
  post: SanityDocument;
}

export default function PostDetail({ post }: PostDetailProps) {
  const { language } = useAppContext();
  const description = language === "kr" ? post.description_kr : post.description_en;
  const media = post.media || [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 flex flex-col h-full overflow-y-auto no-scrollbar gap-4">
        <h1 className="text-size-lg font-bold text-system-text font-ep-gothic">
          {language === "kr" ? post.title_kr : post.title_en}
        </h1>
        
        <div className="text-size-sm text-system-gray font-ep-sans">
          Published: {post.publishedAt} | Client: {post.client}
        </div>

        <div className="prose prose-invert max-w-none text-size-md font-ep-sans text-system-text">
          {Array.isArray(description) && (
            <PortableText value={description} />
          )}
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

            return null;
          })}
        </div>
      </div>
    </div>
  );
}
