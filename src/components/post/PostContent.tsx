"use client";

import React from "react";
import Image from "next/image";
import { PortableText, type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import { useAppContext } from "@/context/AppContext";
import CategoryTag, { CATEGORY_COLORS } from "./CategoryTag";
import MediaRenderer from "./MediaRenderer";

interface PostContentProps {
  post: SanityDocument;
  isMobile?: boolean;
}

type MediaItem =
  | {
      _type: "image";
      _key?: string;
      caption?: string;
      image?: { asset?: { _ref?: string } };
      url?: string;
      [key: string]: unknown;
    }
  | {
      _type: "mux.video";
      _key?: string;
      asset?: { playbackId?: string };
      [key: string]: unknown;
    }
  | { _type: "youtube"; _key?: string; url?: string; [key: string]: unknown };

export default function PostContent({
  post,
  isMobile = false,
}: PostContentProps) {
  const {
    language,
    isFullContentMode,
    setIsFullContentMode,
    setCurrentPost,
    isMobile: contextIsMobile,
  } = useAppContext();

  const mobile = isMobile || contextIsMobile;

  const [isExpanded, setIsExpanded] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState<number | string>(0);

  React.useEffect(() => {
    if (!mobile) {
      setCurrentPost(post);
      return () => {
        setCurrentPost(null);
        setIsFullContentMode(false);
      };
    }
  }, [post, setCurrentPost, setIsFullContentMode, mobile]);

  const description =
    language === "kr" ? post.description_kr : post.description_en;
  const media = post.media || [];

  React.useEffect(() => {
    if (!mobile && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [description, isExpanded, language, mobile]);

  const renderDescription = () => (
    <>
      {Array.isArray(description) && (
        <PortableText
          value={description}
          components={{
            block: {
              normal: ({ children }) => (
                <p className="mb-2">
                  {React.Children.map(children, (child) => {
                    if (typeof child === "string") {
                      return child.split("\n").map((line, i, arr) => (
                        <span key={i}>
                          {line}
                          {i < arr.length - 1 && (
                            <>
                              <br />
                              <span className="block h-[0.3em]" />
                            </>
                          )}
                        </span>
                      ));
                    }
                    return child;
                  })}
                </p>
              ),
            },
          }}
        />
      )}
      {post.additional_link && (
        <div className="flex flex-col gap-1 items-start mt-2">
          {Array.isArray(post.additional_link) ? (
            post.additional_link.map((link: string, index: number) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center hover:brightness-50 transition-all text-size-md font-ep-sans text-system-white ${
                  mobile ? "hover:opacity-70" : ""
                }`}
              >
                <Image
                  src={mobile ? "/plus.svg" : "/plus_md.svg"}
                  alt="Plus"
                  width={12}
                  height={12}
                  className="inline mr-1 mb-0.5 w-3 h-3"
                />
                {link}
              </a>
            ))
          ) : (
            <a
              href={post.additional_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center hover:brightness-50 transition-all text-size-md font-ep-sans text-system-white ${
                mobile ? "hover:opacity-70" : ""
              }`}
            >
              <Image
                src={mobile ? "/plus.svg" : "/plus_md.svg"}
                alt="Plus"
                width={12}
                height={12}
                className="inline mr-1 mb-0.5 w-3 h-3"
              />
              {post.additional_link}
            </a>
          )}
        </div>
      )}
    </>
  );

  // --- 모바일 레이아웃 ---
  if (mobile) {
    return (
      <div className="h-full w-full overflow-y-auto bg-background no-scrollbar">
        <div className="flex min-h-screen flex-col bg-background pb-5 text-system-white">
          <div className="px-2 pb-2 flex justify-between items-start">
            <h1 className="mt-2 font-ep-sans font-normal leading-tight text-size-xl">
              {language === "kr" ? post.title_kr : post.title_en}
            </h1>
            <div className="flex items-start gap-x-2 mt-2">
              <span className="text-size-sm text-system-white font-normal font-ep-sans leading-none">
                {post.publishedAt}
              </span>
              <div className="flex flex-col gap-0.5 items-end">
                <CategoryTag
                  categories={post.category}
                  className="flex-col gap-0.5 items-end"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-2 mb-5">
            {media.map((item: any, index: number) => (
              <MediaRenderer
                key={item._key || index}
                item={item}
                index={index}
                isMobile={mobile}
              />
            ))}
          </div>
          <div className="mx-2 break-keep wrap-break-word font-ep-sans font-medium leading-relaxed text-size-sm text-system-white">
            {renderDescription()}
          </div>
        </div>
      </div>
    );
  }

  // --- 데스크탑 레이아웃 ---
  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {!isFullContentMode && (
        <div
          className={`p-2 flex flex-col h-full overflow-y-auto no-scrollbar gap-4 transition-all duration-300 ${
            isExpanded ? "pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-2xl font-normal text-system-white font-ep-sans leading-tight max-w-[75%]">
              {language === "kr" ? post.title_kr : post.title_en}
            </h1>
            <div className="flex items-start gap-1.5 shrink-0">
              <span className="text-size-md text-system-white font-ep-sans">
                {post.publishedAt?.toString()}
              </span>
              <div className="flex flex-col items-end gap-1 mt-1">
                {post.category?.map((category: string) => (
                  <span
                    key={category}
                    className="px-[0.4rem] py-[0.2rem] rounded-[5px] text-[11px] leading-none font-medium font-ep-sans text-system-dark whitespace-nowrap"
                    style={{
                      backgroundColor: CATEGORY_COLORS[category] || "#787878",
                    }}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 pb-20">
            {media.map((item: any, index: number) => (
              <MediaRenderer
                key={item._key || index}
                item={item}
                index={index}
                isMobile={mobile}
              />
            ))}
          </div>
        </div>
      )}

      {!isFullContentMode && (
        <div
          className={`absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-system-dark to-transparent z-50 pointer-events-none transition-opacity duration-500 ${
            isExpanded ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      {/* 설명글 패널 */}
      <div
        className={`absolute bottom-0 left-0 w-full transition-all duration-500 ease-in-out bg-system-dark z-40 flex flex-col ${
          isFullContentMode ? "h-full" : ""
        }`}
        style={{
          height: isFullContentMode
            ? "100%"
            : isExpanded
              ? `${contentHeight}px`
              : "70px",
        }}
      >
        <div
          onClick={() => !isFullContentMode && setIsExpanded(!isExpanded)}
          className={`flex justify-between items-start px-2 pt-2 h-full relative overflow-hidden break-keep wrap-break-word hover:bg-system-dark/80 ${
            !isFullContentMode ? "cursor-pointer" : ""
          }`}
        >
          <div className={`flex-1 pr-8 h-full overflow-hidden`}>
            <div
              ref={contentRef}
              className="max-w-none text-size-md font-ep-sans text-system-white pb-5"
            >
              {renderDescription()}
            </div>
          </div>

          {!isFullContentMode && (
            <div className="absolute top-2 right-2">
              <Image
                src="/arrow.svg"
                alt="Toggle Description"
                width={16}
                height={16}
                className={`w-4 h-4 transition-transform duration-300 ${
                  isExpanded ? "-rotate-180" : ""
                }`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
