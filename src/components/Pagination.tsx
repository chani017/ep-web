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

  return (
    <div
      className={`flex justify-start items-center text-size-md gap-1 ${className}`}
    >
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="font-ep-sans text-system-white text-size-md hover:bg-system-dark-gray rounded-md min-w-3 text-center cursor-pointer"
        >
          〈
        </button>
      )}
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`font-ep-sans transition-colors cursor-pointer px-1.5 leading-5 rounded-md min-w-5 text-center ${
            currentPage === i + 1
              ? "text-system-white bg-transparent hover:bg-system-dark-gray"
              : "text-system-white bg-[#464646] hover:bg-system-dark-gray hover:text-system-white"
          }`}
        >
          {i + 1}
        </button>
      ))}
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
