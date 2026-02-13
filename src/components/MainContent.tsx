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
import { usePage } from "@/hooks/usePage";
import { useDropdown } from "@/hooks/useDropdown";
import { useResponCols } from "@/hooks/useResponCols";
import Pagination from "./Pagination";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

interface FilterState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  uniqueYears: string[];
  filteredPosts: SanityDocument[];
  availableCategories: Set<string>;
}

interface MainContentProps {
  posts: SanityDocument[];
  filterState?: FilterState;
}

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

// 썸네일 크기 배율 정의 (small, medium, large)
const SIZE_MULTIPLIERS: Record<string, number> = {
  small: 0.65,
  medium: 0.8,
  large: 1.0,
};

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
    // 뷰포트 진입 감지 (Lazy Loading)
    const [cardRef, inView] = useInView();
    // 비디오 로딩 조건: 이미 로드되었거나 뷰포트에 진입했을 때
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
        href={`/${post.slug.current}`}
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

const CATEGORIES = [
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
];

export default function MainContent({
  filterState,
  ...rest
}: MainContentProps) {
  void rest.posts;
  const {
    language,
    setLanguage,
    isFullContentMode,
    currentPost,
    isMobile,
    categoryColors,
  } = useAppContext();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"img" | "list">("img");

  // useDropdown for Category
  const {
    isOpen: isCategoryOpen,
    setIsOpen: setIsCategoryOpen,
    dropdownRef: categoryDropdownRef,
  } = useDropdown();

  const {
    searchTerm,
    setSearchTerm,
    selectedYear,
    setSelectedYear,
    selectedCategory,
    setSelectedCategory,
    uniqueYears,
    filteredPosts,
    availableCategories,
  } = filterState || {};

  // 페이지네이션 훅
  const { currentPage, setCurrentPage, paginatedPosts, totalPages } = usePage(
    filteredPosts ?? [],
  );

  // 연도 드롭다운 제어 훅
  const {
    isOpen: isYearOpen,
    setIsOpen: setIsYearOpen,
    dropdownRef: yearDropdownRef,
  } = useDropdown();
  // 반응형 컬럼 수 계산 훅
  const [containerRef, cols] = useResponCols([isFullContentMode, isMobile]);

  // 포스트 그리드 레이아웃 계산
  const renderedPosts = React.useMemo(() => {
    return paginatedPosts.map((post, index) => {
      const rowStart = Math.floor(index / cols) * cols;
      const rowEnd = Math.min(rowStart + cols, paginatedPosts.length);
      const rowSlice = paginatedPosts.slice(rowStart, rowEnd);
      const rowItemCount = rowSlice.length;

      const actualTotalM = rowSlice.reduce(
        (sum, p) =>
          sum + (SIZE_MULTIPLIERS[p.thumbnail_size || "medium"] || 1.0),
        0,
      );

      const isLastRowShort = rowItemCount < cols;
      const paddedTotalM = isLastRowShort
        ? actualTotalM + (cols - rowItemCount) * SIZE_MULTIPLIERS.medium
        : actualTotalM;

      const m = SIZE_MULTIPLIERS[post.thumbnail_size || "medium"] || 1.0;
      const widthPct = (m / paddedTotalM) * 100;

      return {
        post,
        widthPct,
        rowItemsCount: rowItemCount,
      };
    });
  }, [paginatedPosts, cols]);

  return (
    <>
      <header className="flex justify-between items-center p-1 border-b border-system-gray submenu h-10">
        {/* 상단 헤더 */}
        <div className="shrink-0 px-1 h-full flex items-center">
          <Link
            href="/"
            className="relative h-full flex items-center group cursor-pointer w-fit"
          >
            <div className="text-size-xl font-me text-system-white font-ep-sans uppercase transition-all duration-100 transform opacity-150 group-hover:opacity-0 whitespace-nowrap">
              Everyday Practice
            </div>
            <div className="absolute inset-0 flex items-center text-size-xl font-medium text-system-white font-ep-sans transition-all duration-150 transform translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 whitespace-nowrap">
              일상의실천
            </div>
          </Link>
        </div>
        <div className="shrink-0 flex items-center text-size-xl font-normal font-ep-sans">
          {/* 국문 / 영문 전환 */}
          <span
            className={`${
              language === "kr" ? "text-system-white" : "text-system-gray"
            } cursor-pointer hover:text-system-white transition-colors`}
            onClick={() => setLanguage("kr")}
          >
            Kor
          </span>
          <span className="text-system-gray mx-1">/</span>
          <span
            className={`${
              language === "en" ? "text-system-white" : "text-system-gray"
            } cursor-pointer hover:text-system-white transition-colors`}
            onClick={() => setLanguage("en")}
          >
            Eng
          </span>
        </div>
        {/* 이메일 링크 */}
        <div className="shrink-0 h-full flex items-center">
          <Link
            href="mailto:hello@everyday-practice.com"
            className="text-size-xl font-normal text-system-gray font-ep-sans hover:text-system-white transition-colors cursor-pointer whitespace-nowrap"
          >
            hello@everyday-practice.com
          </Link>
        </div>
      </header>
      {/* 태그 */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* 상세 페이지: 제목 및 메타 데이터 */}
        {isFullContentMode && currentPost ? (
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 flex flex-col gap-6">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl font-normal text-system-white font-ep-sans leading-tight max-w-[80%] break-keep">
                {language === "kr"
                  ? currentPost.title_kr
                  : currentPost.title_en}
              </h1>
              <div className="flex items-start gap-2 shrink-0">
                <span className="text-xl text-system-white font-ep-sans">
                  {currentPost.publishedAt}
                </span>
                <div className="flex flex-col items-end gap-1 mt-1">
                  {currentPost.category?.map((category: string) => (
                    <span
                      key={category}
                      className="px-2 py-1 rounded-[6px] text-size-sm leading-none font-medium font-ep-sans text-system-dark whitespace-nowrap"
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
            {/* 상세 페이지: 미디어 리스트 (이미지, 비디오) */}
            <div>
              {(currentPost.media || []).map(
                (
                  item: {
                    _type: string;
                    _key?: string;
                    caption?: string;
                    asset?: { playbackId?: string };
                    url?: string;
                    image?: { asset?: { _ref?: string } };
                    [key: string]: unknown;
                  },
                  index: number,
                ) => {
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
                          {...({ videoQuality: "basic" } as {
                            videoQuality?: string;
                          })}
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
                },
              )}
            </div>
          </div>
        ) : (
          <>
            {/* 검색, 연도 및 콘텐츠 영역 */}
            <div
              className="flex-1 overflow-y-auto no-scrollbar relative"
              ref={containerRef}
            >
              <div className="sticky top-0 pb-1 bg-background/80 backdrop-blur-md z-50">
                {/* 카테고리 필터 리스트 */}
                <div className="relative flex flex-wrap justify-start items-center px-2 py-1 pr-16 gap-x-2 text-size-xl leading-tight">
                  {CATEGORIES.map((category) => {
                    const isAvailable =
                      category === "All Types" ||
                      availableCategories?.has(category);
                    const isSelected = selectedCategory === category;
                    return (
                      <div
                        key={category}
                        className={`${
                          isSelected
                            ? "text-system-white"
                            : isAvailable
                              ? "text-system-gray hover:text-system-white"
                              : "text-system-gray opacity-50"
                        } cursor-pointer transition-all duration-200`}
                        onClick={() => setSelectedCategory?.(category)}
                      >
                        {category}
                      </div>
                    );
                  })}
                  {/* 뷰 모드 전환 버튼 (그리드/리스트) */}
                  <button
                    className="absolute right-2 top-1 flex items-center gap-1 text-system-gray cursor-pointer transition-colors"
                    onClick={() =>
                      setViewMode(viewMode === "img" ? "list" : "img")
                    }
                  >
                    <img src="/change.svg" alt="Change" className="w-4 h-4" />
                    <span>{viewMode}</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 px-2 items-stretch gap-x-3 mt-12">
                {/* 검색창 */}
                <div className="col-span-2 flex items-end bg-system-dark-gray border-b border-system-gray relative">
                  {!searchTerm && (
                    <div className="absolute inset-0 pointer-events-none text-size-md font-ep-sans text-system-white flex items-center justify-between pr-1 py-2">
                      <div className="flex items-center">
                        {isSearchFocused && (
                          <span className="w-px h-[1em] bg-system-white animate-blink" />
                        )}
                        Search
                      </div>
                      <img src="/search.svg" alt="Search" className="w-4 h-4" />
                    </div>
                  )}
                  <input
                    type="text"
                    className={`w-full bg-transparent border-none outline-none text-size-md text-system-white font-ep-sans h-full ${
                      !searchTerm ? "caret-transparent" : ""
                    }`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm?.(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  {searchTerm && (
                    <img
                      src="/search.svg"
                      alt="Search"
                      className="w-4 h-4 absolute right-1 bottom-1 pointer-events-none"
                    />
                  )}
                </div>
                {/* 연도별 필터링 */}
                <div
                  className="col-span-1 py-1.5 border-b border-system-gray relative flex items-end"
                  ref={yearDropdownRef}
                >
                  <button
                    className="w-full flex items-center justify-between bg-transparent text-size-md text-system-white font-ep-sans cursor-pointer h-full"
                    onClick={() => setIsYearOpen(!isYearOpen)}
                  >
                    <span>{selectedYear}</span>
                    <img
                      src="/dropdown.svg"
                      alt="Dropdown"
                      className={`w-3 h-3 transition-transform duration-150 ${isYearOpen ? "-rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`absolute top-full left-0 w-full bg-system-dark-gray backdrop-blur-xl border-t border-b border-system-gray/30 z-40 overflow-hidden transition-all duration-150 ease-in-out origin-top ${
                      isYearOpen
                        ? "max-h-48 opacity-100 translate-y-0 overflow-y-auto no-scrollbar shadow-2xl"
                        : "max-h-0 opacity-0 -translate-y-1 pointer-events-none border-transparent"
                    }`}
                  >
                    {(uniqueYears ?? []).map((year: string) => (
                      <div
                        key={year}
                        className={`px-1.5 py-0.5 text-size-md font-ep-sans cursor-pointer transition-colors ${
                          selectedYear === year
                            ? "text-system-white hover:bg-white/10"
                            : "text-system-white hover:bg-white/10"
                        }`}
                        onClick={() => {
                          setSelectedYear?.(year);
                          setIsYearOpen(false);
                        }}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                </div>
                {/* 결과 개수 표시 및 필터 리셋 버튼 */}
                <div className="col-span-1 text-size-sm text-system-gray font-ep-sans border-b border-system-gray flex items-center justify-between">
                  <span>{(filteredPosts ?? []).length} results</span>
                  {(searchTerm ||
                    selectedYear !== "Year" ||
                    selectedCategory !== "All Types") && (
                    <button
                      className="flex items-center gap-1 text-system-white text-size-md hover:brightness-50 transition-all duration-150 ease-in-out cursor-pointer"
                      onClick={() => {
                        setSearchTerm?.("");
                        setSelectedYear?.("Year");
                        setSelectedCategory?.("All Types");
                      }}
                    >
                      <span className="mr-1">Reset</span>
                      <img
                        src="/reset.svg"
                        alt="Reset"
                        className="w-3.5 h-3.5"
                      />
                    </button>
                  )}
                </div>
              </div>
              <div
                className={
                  viewMode === "list"
                    ? "grid grid-cols-4 px-2"
                    : "flex flex-wrap px-2 py-1 items-end mt-10"
                }
                style={
                  viewMode === "list"
                    ? undefined
                    : {
                        columnGap: "0.5rem",
                        rowGap: "2.5rem",
                      }
                }
              >
                {/* 포스트 목록 렌더링 (그리드/리스트 뷰) */}
                {renderedPosts.map(({ post, widthPct, rowItemsCount }) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    language={language}
                    viewMode={viewMode}
                    cols={cols}
                    rowItemsCount={rowItemsCount}
                    widthPct={widthPct}
                    categoryColors={categoryColors}
                  />
                ))}
              </div>
              {/* 페이지네이션 컴포넌트 */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  containerRef.current?.scrollTo({ top: 0 });
                }}
                className="px-4 pt-8 pb-10"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
