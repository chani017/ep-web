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
import { usePostFilter } from "@/hooks/usePostFilter";
import { useYearDropdown } from "@/hooks/useYearDropdown";
import { useResponCols } from "@/hooks/useResponCols";

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

interface PostCardProps {
  post: any;
  language: string;
  viewMode: "img" | "list";
  cols: number;
  rowItemsCount: number;
}

const PostCard = React.memo(({ post, language, viewMode, cols, rowItemsCount }: PostCardProps) => {
  const multipliers: Record<string, number> = { small: 0.5, medium: 0.75, large: 1.0 };
  const m = multipliers[post.thumbnail_size || "medium"] || 1.0;

  const [cardRef, inView] = useInView();

  const muxThumbnail = post.playbackId
    ? `https://image.mux.com/${post.playbackId}/thumbnail.webp?width=480&time=0`
    : null;

  if (viewMode === "list") {
    return (
      <Link
        href={`/${post.slug.current}`}
        className="col-span-4 grid grid-cols-4 border-b border-system-gray min-h-10 hover:bg-system-dark-gray transition-colors items-start px-1 group py-2 gap-x-3"
      >
        <div className="col-span-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-size-md text-system-text font-ep-sans">
          <span>{language === "kr" ? post.title_kr : post.title_en}</span>
          <div className="flex gap-1 shrink-0">
            {post.tags?.map((tag: string) => (
              <span
                key={tag}
                className="px-[0.35rem] py-[0.15rem] rounded-[4px] text-[11px] leading-none font-medium font-ep-sans text-[#131313]"
                style={{ backgroundColor: TAG_COLORS[tag] || "#787878" }}
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

  return (
    <Link
      href={`/${post.slug.current}`}
      className="group flex flex-col"
      style={{
        flex: `${m} 0 0%`,
        maxWidth: rowItemsCount === 1 && cols > 1 ? "50%" : "100%",
      }}
    >
      <div className="flex flex-col w-full pb-10 transition-all duration-200 group-hover:brightness-60">
        <div ref={cardRef} className="relative overflow-hidden bg-[#1a1a1a] w-full flex items-end justify-center">
          {post.playbackId ? (
            <div className="w-full relative">
              {inView ? (
                <MuxPlayer
                  playbackId={post.playbackId}
                  metadataVideoTitle={language === "kr" ? post.title_kr : post.title_en}
                  streamType="on-demand"
                  autoPlay="muted"
                  loop
                  muted
                  placeholder={muxThumbnail || post.imageUrl || undefined}
                  className="w-full h-auto"
                  style={{ "--controls": "none" } as any}
                  {...{ videoQuality: "basic" } as any}
                />
              ) : (
                <img
                  src={muxThumbnail || post.imageUrl}
                  className="w-full h-auto object-contain"
                  alt=""
                  loading="lazy"
                />
              )}
            </div>
          ) : post.imageUrl ? (
            <img src={post.imageUrl} className="w-full h-auto object-contain" />
          ) : (
            <div className="w-full aspect-square flex items-center justify-center text-system-gray text-size-sm font-ep-sans">
              No Media
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 pt-2 w-full min-h-18">
          <p className="text-system-text text-size-md font-medium font-ep-sans leading-tight line-clamp-2">
            {language === "kr" ? post.title_kr : post.title_en}
          </p>
          <div className="flex flex-wrap gap-1">
            {post.tags?.map((tag: string) => (
              <span
                key={tag}
                className="px-[0.35rem] py-[0.15rem] rounded-[4px] text-[11px] leading-none font-medium font-ep-sans text-[#131313]"
                style={{ backgroundColor: TAG_COLORS[tag] || "#787878" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
});

PostCard.displayName = "PostCard";

export default function MainContent({
  posts,
}: MainContentProps) {
  const { language, setLanguage, isFullContentMode, currentPost } = useAppContext();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"img" | "list">("img");

  const {
    searchTerm, setSearchTerm,
    selectedYear, setSelectedYear,
    selectedTag, setSelectedTag,
    currentPage, setCurrentPage,
    uniqueYears, filteredPosts, paginatedPosts, totalPages,
  } = usePostFilter(posts);

  const { isYearOpen, setIsYearOpen, yearDropdownRef } = useYearDropdown();
  const [containerRef, cols] = useResponCols([isFullContentMode]);

  return (
    <>
    {/* 메인 헤더 */}
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
                        {...{ videoQuality: "basic" } as any}
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
            {/* 검색, 연도 및 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative" ref={containerRef}>
              <div className="sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="relative flex flex-wrap justify-start items-center px-2 py-1 pr-16 gap-x-2 text-size-xl">
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
                    className="absolute right-2 top-1 flex items-center gap-1 text-system-gray hover:text-system-text cursor-pointer transition-colors"
                    onClick={() => setViewMode(viewMode === "img" ? "list" : "img")}
                  >
                    <img src="/change.svg" alt="Change" className="w-4 h-4" />
                    <span>{viewMode}</span>
                  </button>
                </div>
              </div>
              {/* 검색창, 연도 선택, 콘텐츠 영역 */}
              <div
                className="grid grid-cols-4 px-2 items-stretch gap-x-3 pt-15 pb-10"
              >
                {/* 검색창 */}
                <div
                  className="col-span-2 flex items-end bg-system-dark-gray px-1 pb-2 border-b border-system-gray relative"
                >
                  {!searchTerm && (
                    <span
                      className={`absolute pointer-events-none text-size-md font-ep-sans text-system-text transition-all duration-100 ease-in-out flex items-center ${
                        isSearchFocused ? "left-[calc(20%-5rem)]" : "left-1"
                      }`}
                      style={{ bottom: "0.25rem" }}
                    >
                      {isSearchFocused && (
                        <span className="mr-px w-px h-[1em] bg-system-text animate-blink" />
                      )}
                      Search
                    </span>
                  )}
                  <input
                    type="text"
                    className={`w-full bg-transparent border-none outline-none text-size-md text-system-text font-ep-sans ${
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
                    className="w-4 h-4 mb-[0.rem]"
                  />
                </div>
                {/* 연도 선택 */}
                <div
                  className="col-span-1 pb-1 border-b border-system-gray relative flex items-end"
                  ref={yearDropdownRef}
                >
                  <button
                    className="w-full flex items-center justify-between bg-transparent text-size-md text-system-text font-ep-sans cursor-pointer h-full"
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
                    className={`absolute top-full left-0 w-full bg-system-dark-gray backdrop-blur-xl border-t border-b border-system-gray/30 z-40 overflow-hidden transition-all duration-200 ease-in-out origin-top ${
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
                {/* 프로젝트 갯수 */}
                <div className="col-span-1 text-size-sm text-system-gray font-ep-sans text-left border-b border-system-gray flex items-center">
                  {filteredPosts.length} results
                </div>
              </div>
              {viewMode === "list" ? (
                <div className="grid grid-cols-4 px-2">
                  {paginatedPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      language={language}
                      viewMode={viewMode}
                      cols={cols}
                      rowItemsCount={0}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col px-2 py-1" style={{ gap: "2.5rem" }}>
                  {Array.from({
                    length: Math.ceil(paginatedPosts.length / cols),
                  }).map((_, rowIndex) => {
                    const rowItems = paginatedPosts.slice(
                      rowIndex * cols,
                      (rowIndex + 1) * cols,
                    );

                    return (
                      <div
                        key={rowIndex}
                        className="flex w-full items-end"
                        style={{ gap: "0.5rem" }}
                      >
                        {rowItems.map((post) => (
                          <PostCard
                            key={post._id}
                            post={post}
                            language={language}
                            viewMode={viewMode}
                            cols={cols}
                            rowItemsCount={rowItems.length}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
              {/* 페이지네이션 */}
              {totalPages >= 1 && (
                <div className="px-2 pt-10 pb-20 flex justify-start items-center text-size-xl">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <React.Fragment key={i + 1}>
                      <button
                        onClick={() => {
                          setCurrentPage(i + 1);
                          containerRef.current?.scrollTo({ top: 0 });
                        }}
                        className={`font-ep-sans transition-colors cursor-pointer ${
                          currentPage === i + 1
                            ? "text-system-text"
                            : "text-system-gray hover:text-system-text"
                        }`}
                      >
                        {i + 1}
                      </button>
                      {i < totalPages - 1 && (
                        <span className="text-system-gray mx-1">/</span>
                      )}
                    </React.Fragment>
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
