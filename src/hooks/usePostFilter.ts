import { useState, useMemo, useCallback } from "react";
import { type SanityDocument } from "next-sanity";

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
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        post.title_kr?.toLowerCase().includes(term) ||
        post.title_en?.toLowerCase().includes(term) ||
        post.client?.toLowerCase().includes(term) ||
        post.category?.some((Category: string) =>
          Category.toLowerCase().includes(term),
        );

      const matchesYear =
        selectedYear === "Year" || post.year?.toString() === selectedYear;

      const matchesCategory =
        selectedCategory === "All Types" ||
        post.category?.some(
          (Category: string) => Category === selectedCategory,
        );

      return matchesSearch && matchesYear && matchesCategory;
    });
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
  };
}
