import { useState, useMemo, useEffect } from "react";
import { type SanityDocument } from "next-sanity";

const ITEMS_PER_PAGE = 20;

export function usePostFilter(posts: SanityDocument[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("Year");
  const [selectedTag, setSelectedTag] = useState<string>("All Types");
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueYears = useMemo(() => {
    const years = posts
      .map((post) => post.publishedAt?.toString())
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
        post.tags?.some((tag: string) => tag.toLowerCase().includes(term));

      const matchesYear =
        selectedYear === "Year" ||
        post.publishedAt?.toString() === selectedYear;

      const matchesTag =
        selectedTag === "All Types" ||
        post.tags?.some((tag: string) => tag === selectedTag);

      return matchesSearch && matchesYear && matchesTag;
    });
  }, [posts, searchTerm, selectedYear, selectedTag]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedYear, selectedTag]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  return {
    searchTerm,
    setSearchTerm,
    selectedYear,
    setSelectedYear,
    selectedTag,
    setSelectedTag,
    currentPage,
    setCurrentPage,
    uniqueYears,
    filteredPosts,
    paginatedPosts,
    totalPages,
  };
}
