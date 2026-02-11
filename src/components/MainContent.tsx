"use client";

import React from "react";
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
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

interface MainContentProps {
  posts: SanityDocument[];
}

const TAG_COLORS: Record<string, string> = {
  Graphic: "#42ff00",
  Identity: "#FFEB23",
  Website: "#92FFF8",
  Editorial: "#D8BAFF",
  Motion: "#7572d5",
  Space: "#d089c0",
};

export default function MainContent({
  posts,
}: MainContentProps) {
  const { language, setLanguage, isFullContentMode, currentPost } = useAppContext();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState<string>("Year");
  const [selectedTag, setSelectedTag] = React.useState<string>("All Types");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [isYearOpen, setIsYearOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"img" | "list">("img");
  const yearDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(e.target as Node)
      ) {
        setIsYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const uniqueYears = React.useMemo(() => {
    const years = posts
      .map((post) => post.publishedAt?.toString())
      .filter((year): year is string => !!year);
    return [
      "Year",
      ...Array.from(new Set(years)).sort((a, b) => b.localeCompare(a)),
    ];
  }, [posts]);

  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title_kr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesYear =
        selectedYear === "Year" ||
        post.publishedAt?.toString() === selectedYear;

      const matchesTag =
        selectedTag === "All Types" ||
        post.tags?.some((tag: string) => tag === selectedTag);

      return matchesSearch && matchesYear && matchesTag;
    });
  }, [posts, searchTerm, selectedYear, selectedTag]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [cols, setCols] = React.useState(4);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width < 380) setCols(1);
        else if (width < 620) setCols(2);
        else if (width < 900) setCols(3);
        else if (width < 1200) setCols(4);
        else if (width < 1550) setCols(5);
        else setCols(6);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isFullContentMode]);

  return (
    <>
      <header className="flex justify-between items-center p-1 border-b border-system-gray submenu h-[2.5rem]">
        <div className="flex-1 px-1 h-full flex items-center overflow-hidden">
          <div className="relative h-full flex items-center group cursor-pointer w-fit">
            <div className="text-size-xl font-me text-system-text font-ep-sans uppercase transition-all duration-100 transform opacity-200 group-hover:opacity-0 whitespace-nowrap">
              Everyday Practice
            </div>
            <div className="absolute inset-0 flex items-center text-size-xl font-medium text-system-text font-ep-sans transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 whitespace-nowrap">
              일상의실천
            </div>
          </div>
        </div>
        <div className="flex items-center text-center text-size-xl font-normal font-ep-sans px-2">
          <span
            className={`${
              language === "kr" ? "text-system-text" : "text-system-gray"
            } cursor-pointer hover:text-system-text transition-colors`}
            onClick={() => setLanguage("kr")}
          >
            Kor
          </span>
          <span className="text-system-gray mx-1">/</span>
          <span
            className={`${
              language === "en" ? "text-system-text" : "text-system-gray"
            } cursor-pointer hover:text-system-text transition-colors`}
            onClick={() => setLanguage("en")}
          >
            Eng
          </span>
        </div>
        <div className="flex-1 px-1 h-full flex justify-end items-center overflow-hidden">
          <Link
            href="mailto:hello@everyday-practice.com"
            className="text-size-xl font-normal text-system-gray font-ep-sans hover:text-system-text transition-colors cursor-pointer w-fit"
          >
            hello@everyday-practice.com
          </Link>
        </div>
      </header>
      {/* 태그 */}
      <div className="flex flex-col h-full overflow-hidden">
        {isFullContentMode && currentPost ? (
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 flex flex-col gap-6">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl font-normal text-system-text font-ep-sans leading-tight max-w-[80%] break-keep">
                {language === "kr" ? currentPost.title_kr : currentPost.title_en}
              </h1>
              <div className="flex items-start gap-2 shrink-0">
                <span className="text-xl text-system-text font-ep-sans">
                  {currentPost.publishedAt}
                </span>
                <div className="flex flex-col items-end gap-1 mt-1">
                  {currentPost.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-[6px] text-size-sm leading-none font-medium font-ep-sans text-[#131313] whitespace-nowrap"
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
            
            <div className="flex flex-col gap-12 pb-2 max-w-[1200px] mx-auto w-full">
              {(currentPost.media || []).map((item: any, index: number) => {
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
                        <figcaption className="text-left text-size-md text-system-gray mt-2 font-ep-sans">
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
                    <div key={item._key || index} className="w-full">
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
          </div>
        ) : (
          <>
            <div className="bg-background/80 backdrop-blur-md z-30">
              <div className="flex flex-wrap justify-start items-center px-2 py-1 gap-x-2 text-size-xl">
                {[
                  "All Types",
                  "Graphic",
                  "Editorial",
                  "Website",
                  "Identity",
                  "Space",
                  "Practice",
                  "Motion",
                  "Press",
                  "Everyday",
                ].map((tag) => (
                  <div
                    key={tag}
                    className={`${selectedTag === tag ? "text-system-text" : "text-system-gray"} hover:text-system-text cursor-pointer transition-colors`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </div>
                ))}
                <button
                  className="ml-auto flex items-center gap-1 text-system-gray hover:text-system-text cursor-pointer transition-colors"
                  onClick={() => setViewMode(viewMode === "img" ? "list" : "img")}
                >
                  <img src="/change.svg" alt="Change" className="w-4 h-4" />
                  <span>{viewMode}</span>
                </button>
              </div>
            </div>
            {/* 검색, 연도 */}
            <div className="flex-1 overflow-y-auto no-scrollbar" ref={containerRef}>
              <div
                className="grid px-2 items-end pt-1 pb-1 gap-x-3 pt-10"
                style={{
                  gridTemplateColumns: `repeat(${viewMode === "list" ? 4 : cols}, minmax(0, 1fr))`,
                }}
              >
                <div
                  className={`${viewMode === "list" ? "col-span-2" : `col-span-${Math.max(1, Math.floor(cols / 2))}`} pb-1`}
                >
                  <div className="flex items-center bg-white/10 px-1 relative border-b border-system-gray/50 ">
                    {!searchTerm && (
                      <span
                        className={`absolute pointer-events-none text-size-md font-ep-sans text-system-text transition-all duration-100 ease-in-out flex items-center ${
                          isSearchFocused ? "left-[calc(20%-5rem)]" : "left-1"
                        }`}
                      >
                        {isSearchFocused && (
                          <span className="mr-px w-px h-[1em] bg-system-text animate-blink" />
                        )}
                        Search
                      </span>
                    )}
                    <input
                      type="text"
                      className={`w-full bg-transparent border-none outline-none text-size-md text-system-text font-ep-sans py-1 ${
                        !searchTerm ? "caret-transparent" : ""
                      }`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                    />
                    <img
                      src="/search.svg"
                      alt="Search"
                      className="w-4 h-4 shrink-0 opacity-70"
                    />
                  </div>
                </div>
                <div
                  className="col-span-1 pb-1 border-b border-system-gray/50 relative"
                  ref={yearDropdownRef}
                >
                  <button
                    className="w-full flex items-center justify-between bg-transparent text-size-md text-system-text font-ep-sans cursor-pointer"
                    onClick={() => setIsYearOpen(!isYearOpen)}
                  >
                    <span>{selectedYear}</span>
                    <img
                      src="/dropdown.svg"
                      alt="Dropdown"
                      className={`w-3 h-3 transition-transform duration-200 ${isYearOpen ? "-rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`absolute top-full left-0 w-full bg-[#222222] backdrop-blur-xl border-t border-b border-system-gray/30 z-40 overflow-hidden transition-all duration-200 ease-in-out origin-top ${
                      isYearOpen
                        ? "max-h-48 opacity-100 translate-y-0 overflow-y-auto no-scrollbar shadow-2xl"
                        : "max-h-0 opacity-0 -translate-y-1 pointer-events-none border-transparent"
                    }`}
                  >
                    {uniqueYears.map((year) => (
                      <div
                        key={year}
                        className={`px-1.5 py-0.5 text-size-md font-ep-sans cursor-pointer transition-colors ${
                          selectedYear === year
                            ? "text-system-text hover:bg-white/10"
                            : "text-system-text hover:bg-white/10"
                        }`}
                        onClick={() => {
                          setSelectedYear(year);
                          setIsYearOpen(false);
                        }}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-1 text-size-sm text-system-gray font-ep-sans text-left pb-1 border-b border-system-gray/50">
                  {filteredPosts.length} results
                </div>
              </div>
              {viewMode === "list" ? (
                <div className="grid grid-cols-4 px-2">
                  {Array.from({ length: Math.max(20, filteredPosts.length) }).map(
                    (_, index) => {
                      const post = filteredPosts[index];
                      if (post) {
                        return (
                          <Link
                            key={post._id}
                            href={`/${post.slug.current}`}
                            className="col-span-4 grid grid-cols-4 border-b border-system-gray min-h-10 hover:bg-[#222222] transition-colors items-start px-1 group py-2 gap-x-3"
                          >
                            <div className="col-span-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-size-md text-system-text font-ep-sans">
                              <span>
                                {language === "kr" ? post.title_kr : post.title_en}
                              </span>
                              <div className="flex gap-1 shrink-0">
                                {post.tags?.map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="px-[0.35rem] py-[0.15rem] rounded-[4px] text-[11px] leading-none font-medium font-ep-sans text-[#131313]"
                                    style={{
                                      backgroundColor: TAG_COLORS[tag] || "#787878",
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="col-span-1 text-size-md text-system-text font-ep-sans uppercase">
                              {post.publishedAt}
                            </div>
                            <div className="col-span-1 text-size-md text-system-text font-ep-sans uppercase text-left">
                              {post.client || ""}
                            </div>
                          </Link>
                        );
                      }
                    },
                  )}
                </div>
              ) : (
                <div
                  className="grid gap-2 px-2 py-1 items-start"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  }}
                >
                  {filteredPosts.map((post) => (
                    <Link
                      key={post._id}
                      href={`/${post.slug.current}`}
                      className="group flex flex-col gap-2 pb-10"
                    >
                      <div className="relative overflow-hidden bg-[#1a1a1a] rounded-sm">
                        {post.playbackId ? (
                          <div className="w-full relative">
                            <MuxPlayer
                              playbackId={post.playbackId}
                              metadataVideoTitle={
                                language === "kr" ? post.title_kr : post.title_en
                              }
                              streamType="on-demand"
                              autoPlay="muted"
                              loop
                              muted
                              placeholder={post.imageUrl || undefined}
                              className="w-full h-auto object-contain transition-transform duration-300 group-hover:brightness-80"
                              style={
                                {
                                  "--controls": "none",
                                } as any
                              }
                            />
                          </div>
                        ) : post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            className="w-full h-auto object-contain"
                          />
                        ) : (
                          <div className="w-full aspect-square flex items-center justify-center text-system-gray text-size-sm font-ep-sans">
                            No Media
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-system-text text-size-sm font-ep-sans leading-tight">
                          {language === "kr" ? post.title_kr : post.title_en}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {post.tags?.map((tag: string) => (
                            <span
                              key={tag}
                              className="px-[0.4rem] py-[0.2rem] rounded-[5px] text-[10px] leading-none font-medium font-ep-sans text-[#131313]"
                              style={{
                                backgroundColor: TAG_COLORS[tag] || "#787878",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
