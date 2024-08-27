'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThreadWithReplies } from '@/lib/types/thread';
import { ReplyButton } from './ReplyButton';
import { PostMeta, PostComponent } from './Post';

interface ThreadComponentProps {
  serviceId: string;
  thread: ThreadWithReplies;
  isPreview: boolean;
  serviceOwnerId: string;
}

const ThreadComponent: React.FC<ThreadComponentProps> = ({
  thread,
  isPreview,
  serviceId,
  serviceOwnerId,
}) => {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string>();

  const visibleRepliesNum = 5;
  const visibleReplies =
    isPreview && !showAllReplies
      ? thread.replies.slice(-visibleRepliesNum)
      : thread.replies;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 禁用瀏覽器的滾動恢復功能
      const originalScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';

      const hash = window.location.hash;
      if (hash && !highlightedId) {
        setHighlightedId(hash.substring(1));
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      // 在 useEffect cleanup 中恢復原本的滾動恢復功能
      return () => {
        window.history.scrollRestoration = originalScrollRestoration;
      };
    }
  }, []);

  return (
    <Card
      id={thread.id}
      className={`mb-6 overflow-hidden scroll-mt-20 transition-all duration-300 ${
        highlightedId === thread.id ? 'ring-2 ring-blue-100 bg-blue-50' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-center">
          <CardTitle
            className={'text-2xl font-bold text-center'}
            title={isPreview ? 'Click to view full thread' : ''}
          >
            {isPreview ? (
              <Link
                className="cursor-pointer hover:underline"
                href={`/service/${serviceId}/${thread.id}`}
              >
                {thread.title}
              </Link>
            ) : (
              <>{thread.title}</>
            )}
          </CardTitle>
          <ReplyButton
            serviceId={serviceId}
            threadId={thread.id}
            serviceOwnerId={serviceOwnerId}
          />
        </div>

        <PostMeta
          name={thread.name || ''}
          userId={thread.userId || ''}
          createdAt={thread.xata.createdAt}
          threadId={thread.id}
          serviceId={serviceId}
          reportedIp={thread.userIp || ''}
          serviceOwnerId={serviceOwnerId}
        />
      </CardHeader>
      <CardContent className="pt-3">
        <PostComponent
          content={thread.content || ''}
          imageURL={
            thread.imageToken
              ? `https://imagedelivery.net/BFt8NicDCgLDzBn7OOPidw/${thread.imageToken}/public`
              : thread.image || ''
          }
          youtubeID={thread.youtubeID || ''}
        />
      </CardContent>
      {thread.replies.length > 0 && (
        <CardFooter className="flex flex-col pt-4">
          <Separator className="mb-4" />
          {isPreview && thread.replies.length > visibleRepliesNum && (
            <Button
              variant="outline"
              onClick={() => setShowAllReplies(!showAllReplies)}
              className="w-full mb-4"
            >
              {showAllReplies ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" /> Hide Replies
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" /> Show All{' '}
                  {thread.replies.length} Replies
                </>
              )}
            </Button>
          )}
          <div className="space-y-4 w-full">
            {visibleReplies.map((reply, index) => (
              <div
                key={reply.id}
                className={`mt-4 scroll-mt-20 ${
                  highlightedId === `${reply.id}`
                    ? 'ring-2 ring-blue-100 bg-blue-50'
                    : ''
                }`}
              >
                {index > 0 && <Separator />}
                <div>
                  <PostMeta
                    name={reply.name || ''}
                    userId={reply.userId || ''}
                    createdAt={reply.xata.createdAt}
                    threadId={thread.id}
                    replyId={reply.id}
                    serviceId={serviceId}
                    reportedIp={reply.userIp || ''}
                    serviceOwnerId={serviceOwnerId}
                  />
                  <div className="mt-2">
                    <PostComponent
                      imageURL={
                        reply.imageToken
                          ? `https://imagedelivery.net/BFt8NicDCgLDzBn7OOPidw/${reply.imageToken}/public`
                          : reply.image || ''
                      }
                      content={reply.content || ''}
                      youtubeID={reply.youtubeID || ''}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ThreadComponent;
