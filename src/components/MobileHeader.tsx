"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";

interface MobileHeaderProps {
  filterState?: any;
}

export default function MobileHeader({ filterState }: MobileHeaderProps) {
  const { language, setLanguage, isMobileSidebarOpen, setIsMobileSidebarOpen } =
    useAppContext();

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
    <main className="px-2 sticky top-0 z-50">
      <header className="flex justify-between items-center h-12 border-b border-system-gray bg-background">
        <div
          onClick={() => {
            window.location.href = "/";
          }}
          className="text-size-xl font-light text-system-text font-ep-sans uppercase cursor-pointer"
        >
          Everyday Practice
        </div>

        <div className="flex items-center gap-3">
          {/* 한영 전환 */}
          <div className="flex items-center text-size-xl font-normal font-ep-sans">
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

          {/* 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex flex-col justify-center items-center w-8 h-8 cursor-pointer"
            aria-label="메뉴 열기"
          >
            <img
              src="/plus.svg"
              alt="Menu"
              className={`w-5 h-5 transition-transform duration-300 ${isMobileSidebarOpen ? "rotate-90" : ""}`}
              style={{ display: "block" }}
            />
          </button>
        </div>
      </header>

      {filterState && (
        <div className="flex flex-col gap-2 bg-background/80 backdrop-blur-sm">
          {/* 검색창 — 전체 너비 */}
          <div className="flex items-center px-1 py-2 border-b border-system-gray relative">
            <img src="/search.svg" alt="Search" className="w-4 h-4" />
            {!searchTerm && (
              <span
                className={`absolute pointer-events-none text-[1.2rem] font-ep-sans text-system-gray transition-all duration-100 ease-in-out flex items-center pl-5 ${
                  isSearchFocused ? "left-[calc(20%-3rem)]" : "left-2"
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
              onChange={(e: any) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          <div className="flex gap-2">
            {/* Category */}
            <div
              className="flex-1 pb-1 border-b border-system-gray relative flex items-end"
              ref={categoryDropdownRef}
            >
              <button
                className="w-full flex items-center justify-between bg-transparent text-[1.2rem] text-system-gray font-ep-sans cursor-pointer h-full"
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
                className={`absolute top-full left-0 w-full bg-system-dark-gray backdrop-blur-xl border-t border-b border-system-gray z-40 transition-all duration-200 ease-in-out origin-top ${
                  isCategoryOpen
                    ? "max-h-60 opacity-100 translate-y-0 overflow-y-auto no-scrollbar shadow-2xl"
                    : "max-h-0 opacity-0 -translate-y-1 pointer-events-none border-transparent"
                }`}
              >
                {CATEGORIES.map((category) => (
                  <div
                    key={category}
                    className={`py-1 text-[1.2rem] font-ep-sans cursor-pointer transition-colors ${
                      selectedCategory === category
                        ? "text-system-text bg-white/10"
                        : "text-system-text hover:bg-white/10"
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

            {/* Year */}
            <div
              className="flex-1 pb-1 border-b border-system-gray relative flex items-end"
              ref={yearDropdownRef}
            >
              <button
                className="w-full flex items-center justify-between bg-transparent text-[1.2rem] text-system-gray font-ep-sans cursor-pointer h-full"
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
                className={`absolute top-full left-0 w-full bg-system-dark-gray backdrop-blur-xl border-t border-b border-system-gray z-40 transition-all duration-200 ease-in-out origin-top ${
                  isYearOpen
                    ? "max-h-48 opacity-100 translate-y-0 overflow-y-auto no-scrollbar shadow-2xl"
                    : "max-h-0 opacity-0 -translate-y-1 pointer-events-none border-transparent"
                }`}
              >
                {uniqueYears.map((year: any) => (
                  <div
                    key={year}
                    className={`py-1 text-[1.2rem] font-ep-sans cursor-pointer transition-colors ${
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
          </div>
        </div>
      )}
    </main>
  );
}
import { useYearDropdown } from "@/hooks/useYearDropdown";
