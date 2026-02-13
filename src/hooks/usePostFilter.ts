import { useState, useMemo, useCallback } from "react";
import { type SanityDocument } from "next-sanity";
import { useAppContext } from "@/context/AppContext";

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

function getInitialCategory(): string {
  if (typeof window === "undefined") return "All Types";
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("_categories");
  if (!raw) return "All Types";
  return (
    CATEGORIES.find((c) => c.toLowerCase() === raw.toLowerCase()) || "All Types"
  );
}

function updateCategoryUrl(category: string) {
  const url = new URL(window.location.href);
  if (category === "All Types") {
    url.searchParams.delete("_categories");
  } else {
    url.searchParams.set("_categories", category.toLowerCase());
  }
  window.history.replaceState(null, "", url.toString());
}

export function usePostFilter(posts: SanityDocument[]) {
  const { searchTerm, setSearchTerm } = useAppContext();
  const [selectedYear, setSelectedYear] = useState<string>("Year");
  const [selectedCategory, setSelectedCategoryState] =
    useState<string>(getInitialCategory);

  const setSelectedCategory = useCallback((category: string) => {
    setSelectedCategoryState(category);
    updateCategoryUrl(category);
  }, []);

  const uniqueYears = useMemo(() => {
    const years = posts
      .map((post) => post.year?.toString())
      .filter((year): year is string => !!year);
    return [
      "Year",
      ...Array.from(new Set(years)).sort((a, b) => b.localeCompare(a)),
    ];
  }, [posts]);

  const { filteredPosts, availableCategories } = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const matchingSearchAndYear: SanityDocument[] = [];
    const final: SanityDocument[] = [];
    const categories = new Set<string>();

    posts.forEach((post) => {
      const matchesSearch =
        post.title_kr?.toLowerCase().includes(term) ||
        post.title_en?.toLowerCase().includes(term) ||
        post.client?.toLowerCase().includes(term) ||
        post.category?.some((Category: string) =>
          Category.toLowerCase().includes(term),
        );

      const matchesYear =
        selectedYear === "Year" || post.year?.toString() === selectedYear;

      if (matchesSearch && matchesYear) {
        matchingSearchAndYear.push(post);
        post.category?.forEach((c: string) => categories.add(c));
      }
    });
    matchingSearchAndYear.forEach((post) => {
      const matchesCategory =
        selectedCategory === "All Types" ||
        post.category?.some(
          (Category: string) => Category === selectedCategory,
        );

      if (matchesCategory) {
        final.push(post);
      }
    });

    return { filteredPosts: final, availableCategories: categories };
  }, [posts, searchTerm, selectedYear, selectedCategory]);

  return {
    searchTerm,
    setSearchTerm,
    selectedYear,
    setSelectedYear,
    selectedCategory,
    setSelectedCategory,
    uniqueYears,
    filteredPosts,
    availableCategories,
  };
}
