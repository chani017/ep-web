import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { type SanityDocument } from "next-sanity";

const ITEMS_PER_PAGE = 20;

function getInitialPage(): number {
  if (typeof window === "undefined") return 1;
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("_paged")) || 1;
}

function updatePageUrl(page: number) {
  const url = new URL(window.location.href);
  if (page <= 1) {
    url.searchParams.delete("_paged");
  } else {
    url.searchParams.set("_paged", String(page));
  }
  window.history.replaceState(null, "", url.toString());
}

export function usePage(filteredPosts: SanityDocument[]) {
  const [currentPage, setCurrentPageState] = useState(getInitialPage);
  const isFirstRender = useRef(true);

  const setCurrentPage = useCallback((page: number) => {
    setCurrentPageState(page);
    updatePageUrl(page);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPage(1);
  }, [filteredPosts, setCurrentPage]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  return {
    currentPage,
    setCurrentPage,
    paginatedPosts,
    totalPages,
  };
}
