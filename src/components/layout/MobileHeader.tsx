"use client";

import Image from "next/image";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import { useDropdown } from "@/hooks/useDropdown";
import { CATEGORIES } from "@/constants/common";
import { useSearch } from "@/hooks/useSearch";
import { useRouter } from "next/navigation";

interface FilterState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  uniqueYears: string[];
  filteredPosts: unknown[];
  availableCategories: Set<string>;
}

interface MobileHeaderProps {
  filterState?: FilterState;
  viewMode?: "mobileImg" | "list";
  setViewMode?: (mode: "mobileImg" | "list") => void;
  isPostPage?: boolean;
}

export default function MobileHeader({
  filterState,
  viewMode,
  setViewMode,
}: MobileHeaderProps) {
  const { language, setLanguage } = useAppContext();
  const router = useRouter();

  const { isSearchFocused, setIsSearchFocused, handleSearchChange } =
    useSearch();

  // 카테고리 드롭다운
  const {
    isOpen: isCategoryOpen,
    setIsOpen: setIsCategoryOpen,
    dropdownRef: categoryDropdownRef,
  } = useDropdown();

  // 연도 드롭다운
  const {
    isOpen: isYearOpen,
    setIsOpen: setIsYearOpen,
    dropdownRef: yearDropdownRef,
  } = useDropdown();

  const {
    searchTerm,
    setSearchTerm,
    selectedYear,
    setSelectedYear,
    selectedCategory,
    setSelectedCategory,
    uniqueYears,
    availableCategories,
  } = filterState || {};

  return (
    <main className="sticky top-0 z-50 px-2">
      <header className="flex h-10 items-center justify-between border-b border-system-gray bg-background">
        <div
          onClick={() => {
            router.push("/");
          }}
          className="text-size-xl font-light text-system-white font-ep-sans uppercase cursor-pointer whitespace-nowrap"
        >
          Everyday Practice
        </div>

        {/* 국문/영문 전환 */}
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
        <div className="z-50 flex flex-col bg-background/80 backdrop-blur-[2px]">
          <div className="flex items-center border-b border-system-gray">
            {/* 검색 기능 */}
            <div className="flex-1 flex items-center relative overflow-hidden">
              <div
                className={`ml-auto flex items-center relative transition-all duration-300 ease-in-out ${
                  isSearchFocused || searchTerm
                    ? "w-[calc(100%-1.5rem)]"
                    : "w-full"
                }`}
              >
                <Image
                  src="/search.svg"
                  alt="Search"
                  width={16}
                  height={16}
                  className="w-4 h-4 shrink-0 absolute right-0"
                />
                {!searchTerm && (
                  <span className="absolute inset-y-0 left-0 pointer-events-none text-size-lg font-ep-sans text-system-gray flex items-center">
                    {isSearchFocused && (
                      <span className="mr-px w-px h-[1.2em] bg-system-white animate-blink" />
                    )}
                    <span className="leading-none">Search</span>
                  </span>
                )}
                <input
                  type="text"
                  className="w-full bg-transparent border-none outline-none text-size-md text-system-white font-ep-sans caret-transparent py-[7px] pr-5"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(searchTerm !== "" ||
                selectedCategory !== "All Types" ||
                selectedYear !== "Year") && (
                <button
                  onClick={() => {
                    setSearchTerm?.("");
                    setSelectedCategory?.("All Types");
                    setSelectedYear?.("Year");
                  }}
                  className="transition-opacity active:opacity-50"
                >
                  <Image
                    src="/reset.svg"
                    alt="Reset"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 ml-5">
              <button
                onClick={() => setViewMode && setViewMode("mobileImg")}
                className={`w-5 h-5 transition-colors duration-150 ${
                  viewMode === "mobileImg"
                    ? "bg-system-white"
                    : "bg-system-gray"
                }`}
                style={{
                  maskImage: "url(/gridview.svg)",
                  WebkitMaskImage: "url(/gridview.svg)",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  maskSize: "contain",
                }}
              />
              <button
                onClick={() => setViewMode && setViewMode("list")}
                className={`w-5 h-5 transition-colors duration-150 ${
                  viewMode === "list" ? "bg-system-white" : "bg-system-gray"
                }`}
                style={{
                  maskImage: "url(/listview.svg)",
                  WebkitMaskImage: "url(/listview.svg)",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  maskSize: "contain",
                }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {/* 카테고리 필터링 */}
            <div
              className="flex-1 py-1.5 border-b border-system-gray relative flex items-end"
              ref={categoryDropdownRef}
            >
              <button
                className="w-full flex items-center justify-between bg-transparent text-size-lg text-system-gray font-ep-sans cursor-pointer h-full"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <span>{selectedCategory}</span>
                <Image
                  src="/dropdown.svg"
                  alt="Dropdown"
                  width={14}
                  height={14}
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    isCategoryOpen ? "-rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`absolute top-full left-0 w-full bg-system-dark-gray border-t border-b border-system-gray z-40 transition-all duration-200 ease-in-out origin-top ${
                  isCategoryOpen
                    ? "max-h-60 opacity-100 translate-y-0 overflow-y-auto no-scrollbar"
                    : "max-h-0 opacity-0 -translate-y-1 pointer-events-none"
                }`}
              >
                {CATEGORIES.map((category) => {
                  const isAvailable =
                    category === "All Types" ||
                    availableCategories?.has(category);
                  const isSelected = selectedCategory === category;
                  return (
                    <div
                      key={category}
                      className={`py-1 text-size-lg font-ep-sans cursor-pointer transition-colors ${
                        isSelected
                          ? "text-system-white bg-white/10"
                          : isAvailable
                            ? "text-system-white hover:bg-white/10"
                            : "text-system-white opacity-50"
                      }`}
                      onClick={() => {
                        setSelectedCategory?.(category);
                        setIsCategoryOpen(false);
                      }}
                    >
                      {category}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 연도별 필터링 */}
            <div
              className="flex-1 py-1.5 border-b border-system-gray relative flex items-end"
              ref={yearDropdownRef}
            >
              <button
                className="w-full flex items-center justify-between bg-transparent text-size-lg text-system-gray font-ep-sans cursor-pointer h-full"
                onClick={() => setIsYearOpen(!isYearOpen)}
              >
                <span>{selectedYear}</span>
                <Image
                  src="/dropdown.svg"
                  alt="Dropdown"
                  width={14}
                  height={14}
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    isYearOpen ? "-rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`absolute top-full left-0 w-full bg-system-dark-gray border-t border-b border-system-gray z-40 transition-all duration-200 ease-in-out origin-top ${
                  isYearOpen
                    ? "max-h-48 opacity-100 translate-y-0 overflow-y-auto no-scrollbar"
                    : "max-h-0 opacity-0 -translate-y-1 pointer-events-none"
                }`}
              >
                {(uniqueYears ?? []).map((year: string) => (
                  <div
                    key={year}
                    className={`py-1 text-size-lg font-ep-sans cursor-pointer transition-colors ${
                      selectedYear === year
                        ? "text-system-white bg-white/10"
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
          </div>
        </div>
      )}
    </main>
  );
}
