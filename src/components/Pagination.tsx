"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const windowSize = 5;

    pages.push(1);

    const start = Math.max(2, currentPage - windowSize);
    const end = Math.min(totalPages - 1, currentPage + windowSize);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = renderPageNumbers();

  return (
    <div
      className={`flex justify-start items-center text-size-sm gap-1 ${className}`}
    >
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="font-ep-sans text-system-white hover:bg-system-dark-gray px-2 leading-5 rounded-md min-w-4 text-center cursor-pointer"
        >
          〈
        </button>
      )}

      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="font-ep-sans text-system-white px-2 leading-5 min-w-4 text-center"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`font-ep-sans transition-colors cursor-pointer px-2 leading-5 rounded-md min-w-4 text-center ${
              currentPage === page
                ? "text-system-white bg-transparent hover:bg-system-dark-gray"
                : "text-system-white bg-[#464646] hover:bg-system-dark-gray hover:text-system-white"
            }`}
          >
            {page}
          </button>
        );
      })}

      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="font-ep-sans text-system-white text-size-md hover:bg-system-dark-gray rounded-md min-w-3 text-center cursor-pointer"
        >
          〉
        </button>
      )}
    </div>
  );
}
