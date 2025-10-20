"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  count: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  count,
  next,
  previous,
  currentPage,
  pageSize = 10,
  onPageChange,
}) => {
  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;

  const canGoPrev = previous !== null && currentPage > 1;
  const canGoNext = next !== null && currentPage < totalPages;

  const handlePrev = () => {
    if (canGoPrev) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (canGoNext) onPageChange(currentPage + 1);
  };

  // show max 5 pages around current
  const getPageNumbers = () => {
    const range: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  };

  return (
    <div className="flex justify-center items-center space-x-2 py-4 select-none">
      <button
        disabled={!canGoPrev}
        onClick={handlePrev}
        className={`p-2 rounded-full ${
          canGoPrev
            ? "hover:bg-blue-100 text-blue-700"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        <ChevronLeft size={18} />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : "text-blue-700 hover:bg-blue-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={!canGoNext}
        onClick={handleNext}
        className={`p-2 rounded-full ${
          canGoNext
            ? "hover:bg-blue-100 text-blue-700"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
