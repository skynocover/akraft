'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ThreadWithReplyCount } from '@/lib/types/thread';
import { formateTime } from '@/lib/utils/dayjs';
import { PostContent, MediaContent } from '../thread/Post';

interface ThreadCarouselProps {
  serviceId: string;
  threads: ThreadWithReplyCount[];
}

export const ThreadCarousel: React.FC<ThreadCarouselProps> = ({
  serviceId,
  threads,
}) => {
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

  const renderPreview = (thread: ThreadWithReplyCount) => {
    if (thread.image || thread.youtubeID) {
      return (
        <div className="h-40 w-full overflow-hidden">
          <MediaContent
            imageURL={thread.image || ''}
            youtubeID={thread.youtubeID || ''}
          />
        </div>
      );
    } else {
      return (
        <div className="h-40 p-4 overflow-hidden">
          <PostContent content={thread.content || ''} />
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
          <Card
            key={thread.id}
            className="snap-start flex-shrink-0 w-72 h-full hover:shadow-lg transition-shadow duration-300"
          >
            {renderPreview(thread)}
            <Link href={`/service/${serviceId}/${thread.id}`} target="_blank">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                  {thread.title}
                </h3>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                <span>{formateTime(thread.xata.createdAt)}</span>
                <span className="mx-2">•</span>
                <span>{thread.replyCount} replies</span>
              </CardFooter>
            </Link>
          </Card>
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
