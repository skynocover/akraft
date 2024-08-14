'use client';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ThreadWithReplies } from '@/lib/types/thread';
import { formateTime } from '@/lib/utils/dayjs';

interface ThreadCarouselProps {
  threads: ThreadWithReplies[];
}

export const ThreadCarousel: React.FC<ThreadCarouselProps> = ({ threads }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const renderPreview = (thread: ThreadWithReplies) => {
    if (thread.image) {
      return (
        <div className="relative h-40 w-full">
          <Image
            src={thread.image}
            alt={thread.title || ''}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
      );
    } else if (thread.youtubeID) {
      return (
        <div className="relative h-40 w-full">
          <Image
            src={`https://img.youtube.com/vi/${thread.youtubeID}/0.jpg`}
            alt={thread.title || ''}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      );
    } else {
      return (
        <div className="h-40 p-4 overflow-hidden">
          <p className="text-sm text-gray-600 line-clamp-4">{thread.content}</p>
        </div>
      );
    }
  };

  return (
    <div className="relative">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {threads.map((thread) => (
          <Link
            href={`/service/${'test'}/${thread.id}`}
            target="_blank"
            key={thread.id}
            className="snap-start flex-shrink-0 w-72"
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              {renderPreview(thread)}
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {thread.title}
                </h3>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                <span>{formateTime(thread.xata.createdAt)}</span>
                <span className="mx-2">•</span>
                <span>{thread.replies.length} replies</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
