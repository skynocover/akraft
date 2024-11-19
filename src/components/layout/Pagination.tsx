'use client';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string;
}

export default function PaginationComponent({
  totalPages,
  currentPage,
  baseUrl,
}: PaginationProps) {
  const getPageLink = (page: number) => {
    return `${baseUrl}?page=${page}`;
  };

  const renderPageNumbers = () => {
    const items = [];

    // 如果總頁數小於等於10，顯示所有頁碼
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={getPageLink(i)}
              isActive={currentPage === i}
              className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors
                ${
                  currentPage === i
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // 當頁數超過10頁時的邏輯
      const alwaysVisible = [1, totalPages]; // 永遠顯示第一頁和最後一頁
      const siblingsCount = 2; // 當前頁面左右各顯示2個相鄰頁碼

      // 計算起始和結束頁碼
      let startPage = Math.max(1, currentPage - siblingsCount);
      let endPage = Math.min(totalPages, currentPage + siblingsCount);

      // 確保顯示至少5個頁碼的邏輯
      if (endPage - startPage + 1 < 5) {
        if (currentPage <= 3) {
          // 當前頁在前端時，顯示前5頁
          endPage = Math.min(5, totalPages);
          startPage = 1;
        } else if (currentPage >= totalPages - 2) {
          // 當前頁在後端時，顯示後5頁
          startPage = Math.max(1, totalPages - 4);
          endPage = totalPages;
        }
      }

      for (let i = 1; i <= totalPages; i++) {
        // 顯示：永遠可見的頁碼（第一頁和最後一頁）或在計算範圍內的頁碼
        if (alwaysVisible.includes(i) || (i >= startPage && i <= endPage)) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                href={getPageLink(i)}
                isActive={currentPage === i}
                className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors
                  ${
                    currentPage === i
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'text-gray-600 hover:bg-blue-50'
                  }`}
              >
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        } else if (
          // 添加省略號的條件：
          // 1. 在起始頁碼之前（且起始頁碼大於2）
          // 2. 在結束頁碼之後（且結束頁碼小於倒數第二頁）
          (i === startPage - 1 && startPage > 2) ||
          (i === endPage + 1 && endPage < totalPages - 1)
        ) {
          items.push(
            <PaginationItem key={`ellipsis-${i}`}>
              <span className="w-10 h-10 flex items-center justify-center text-gray-400">
                ...
              </span>
            </PaginationItem>,
          );
        }
      }
    }

    return items;
  };

  return (
    <Pagination className="mb-2">
      <PaginationContent className="flex-wrap gap-1">
        <PaginationItem>
          <PaginationLink
            href={getPageLink(Math.max(1, currentPage - 1))}
            className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors hover:bg-blue-50
              ${
                currentPage === 1
                  ? 'pointer-events-none opacity-50'
                  : 'text-gray-600'
              }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </PaginationLink>
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationLink
            href={getPageLink(Math.min(totalPages, currentPage + 1))}
            className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors hover:bg-blue-50
              ${
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'text-gray-600'
              }`}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
