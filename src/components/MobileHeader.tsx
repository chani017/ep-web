"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import { useYearDropdown } from "@/hooks/useYearDropdown";
import { useRouter } from "next/navigation";

interface MobileHeaderProps {
  filterState?: any;
  viewMode?: "grid" | "list";
  setViewMode?: (mode: "grid" | "list") => void;
  isPostPage?: boolean;
}

export default function MobileHeader({
  filterState,
  viewMode,
  setViewMode,
  isPostPage,
}: MobileHeaderProps) {
  const { language, setLanguage, isMobileSidebarOpen, setIsMobileSidebarOpen } =
    useAppContext();
  const router = useRouter();

  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const categoryDropdownRef = React.useRef<HTMLDivElement>(null);
  const { isYearOpen, setIsYearOpen, yearDropdownRef } = useYearDropdown();

  const {
    searchTerm,
    setSearchTerm,
    selectedYear,
    setSelectedYear,
    selectedCategory,
    setSelectedCategory,
    uniqueYears,
    filteredPosts,
  } = filterState || {};

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

  const CATEGORY_COLORS: Record<string, string> = {
    Graphic: "#42ff00",
    Identity: "#FFEB23",
    Website: "#92FFF8",
    Editorial: "#D8BAFF",
    Motion: "#7572d5",
    Space: "#d089c0",
  };

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <main className="px-1.5 sticky top-0 z-50">
      <header className="flex justify-between items-center h-10 border-b border-system-gray bg-background">
        <div
          onClick={() => {
            router.push("/");
          }}
          className="text-size-xl font-light text-system-white font-ep-sans uppercase cursor-pointer whitespace-nowrap"
        >
          Everyday Practice
        </div>

        {/* 한영 전환 */}
        <div className="flex items-center text-size-xl font-normal font-ep-sans">
          <span
            className={`${
              language === "kr" ? "text-system-white" : "text-system-gray"
            } cursor-pointer hover:text-system-white transition-colors`}
            onClick={() => setLanguage("kr")}
          >
            Kor
          </span>
          <span className="text-system-gray mx-1.5">/</span>
          <span
            className={`${
              language === "en" ? "text-system-white" : "text-system-gray"
            } cursor-pointer hover:text-system-white transition-colors`}
            onClick={() => setLanguage("en")}
          >
            Eng
          </span>
        </div>

        <div className="w-8 h-8" />
      </header>

      {filterState && (
        <div className="flex flex-col bg-background/80 backdrop-blur-[2px] z-50">
          <div className="flex items-center border-b border-system-gray">
            {/* 검색창 */}
            <div className="flex-1 flex items-center py-2 relative">
              <img src="/search.svg" alt="Search" className="w-4 h-4" />
              {!searchTerm && (
                <span
                  className={`absolute inset-y-0 left-0 pointer-events-none text-size-lg font-ep-sans text-system-gray transition-all duration-100 ease-in-out flex items-center pl-5.5 ${
                    isSearchFocused ? "translate-x-4" : "translate-x-0"
                  }`}
                >
                  {isSearchFocused && (
                    <span className="mr-px w-px h-[1.2em] bg-system-white animate-blink" />
                  )}
                  <span className="leading-none">Search</span>
                </span>
              )}
              <input
                type="text"
                className="w-full bg-transparent border-none outline-none text-size-md text-system-white font-ep-sans caret-transparent"
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
            <div className="flex items-center gap-2">
              {(searchTerm !== "" ||
                selectedCategory !== "All Types" ||
                selectedYear !== "Year") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Types");
                    setSelectedYear("Year");
                  }}
                  className="transition-opacity active:opacity-50"
                >
                  <img src="/reset.svg" alt="Reset" className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 ml-5">
              <button
                onClick={() => setViewMode && setViewMode("grid")}
                className={`transition-all duration-150 ${viewMode === "grid" ? "opacity-100" : "opacity-30"}`}
              >
                <img src="/gridview.svg" alt="Grid View" className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode && setViewMode("list")}
                className={`transition-all duration-150 ${viewMode === "list" ? "opacity-100" : "opacity-30"}`}
              >
                <img src="/listview.svg" alt="List View" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            {/* 카테고리 */}
            <div
              className="flex-1 py-2 border-b border-system-gray relative flex items-end"
              ref={categoryDropdownRef}
            >
              <button
                className="w-full flex items-center justify-between bg-transparent text-size-lg text-system-gray font-ep-sans cursor-pointer h-full"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <span>{selectedCategory}</span>
                <img
                  src="/dropdown.svg"
                  alt="Dropdown"
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${isCategoryOpen ? "-rotate-180" : ""}`}
                />
              </button>
              <div
                className={`absolute top-full left-0 w-full bg-system-dark-gray border-t border-b border-system-gray z-40 transition-all duration-200 ease-in-out origin-top ${
                  isCategoryOpen
                    ? "max-h-60 opacity-100 translate-y-0 overflow-y-auto no-scrollbar"
                    : "max-h-0 opacity-0 -translate-y-1 pointer-events-none"
                }`}
              >
                {CATEGORIES.map((category) => (
                  <div
                    key={category}
                    className={`py-1 text-size-lg font-ep-sans cursor-pointer transition-colors ${
                      selectedCategory === category
                        ? "text-system-white bg-white/10"
                        : "text-system-white hover:bg-white/10"
                    }`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsCategoryOpen(false);
                    }}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>

            {/* 연도 */}
            <div
              className="flex-1 py-2 border-b border-system-gray relative flex items-end"
              ref={yearDropdownRef}
            >
              <button
                className="w-full flex items-center justify-between bg-transparent text-size-lg text-system-gray font-ep-sans cursor-pointer h-full"
                onClick={() => setIsYearOpen(!isYearOpen)}
              >
                <span>{selectedYear}</span>
                <img
                  src="/dropdown.svg"
                  alt="Dropdown"
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${isYearOpen ? "-rotate-180" : ""}`}
                />
              </button>
              <div
                className={`absolute top-full left-0 w-full bg-system-dark-gray border-t border-b border-system-gray z-40 transition-all duration-200 ease-in-out origin-top ${
                  isYearOpen
                    ? "max-h-48 opacity-100 translate-y-0 overflow-y-auto no-scrollbar"
                    : "max-h-0 opacity-0 -translate-y-1 pointer-events-none"
                }`}
              >
                {uniqueYears.map((year: any) => (
                  <div
                    key={year}
                    className={`py-1 text-size-lg font-ep-sans cursor-pointer transition-colors ${
                      selectedYear === year
                        ? "text-system-white bg-white/10"
                        : "text-system-white hover:bg-white/10"
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
          </div>
        </div>
      )}
    </main>
  );
}
