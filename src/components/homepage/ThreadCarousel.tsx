'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThreadWithReplies } from '@/lib/types/thread';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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

  return (
    <div className="relative">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {threads.map((thread) => (
          <Card key={thread.id} className="snap-start flex-shrink-0 w-80 mr-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2 truncate">
                {thread.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {thread.content}
              </p>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              {formateTime(thread.xata.createdAt)} • {thread.replies.length}{' '}
              replies
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 transform -translate-y-1/2"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 transform -translate-y-1/2"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
