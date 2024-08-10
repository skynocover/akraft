'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string; // 基礎 URL，用於生成頁面連結
}

export default function Pagination({
  totalPages,
  currentPage,
  baseUrl,
}: PaginationProps) {
  const getPageLink = (page: number) => {
    return `${baseUrl}?page=${page}`;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mb-4">
      <Link href={getPageLink(currentPage - 1)} passHref>
        <Button variant="outline" size="icon" disabled={currentPage === 1}>
          <ChevronLeft />
        </Button>
      </Link>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link href={getPageLink(page)} key={page} passHref>
          <Button variant={page === currentPage ? 'default' : 'outline'}>
            {page}
          </Button>
        </Link>
      ))}
      <Link href={getPageLink(currentPage + 1)} passHref>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </Button>
      </Link>
    </div>
  );
}
