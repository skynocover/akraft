'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
}

const ThreadComponent: React.FC<ThreadComponentProps> = ({
  thread,
  isPreview,
  serviceId,
}) => {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string>();

  const router = useRouter();
  const visibleRepliesNum = 5;
  const visibleReplies =
    isPreview && !showAllReplies
      ? thread.replies.slice(-visibleRepliesNum)
      : thread.replies;

  const handleTitleClick = () => {
    if (isPreview) {
      router.push(`/service/${serviceId}/${thread.id}`);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        setHighlightedId(hash.substring(1));
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
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
            className={`text-2xl font-bold text-center ${
              isPreview ? 'cursor-pointer hover:underline' : ''
            }`}
            onClick={handleTitleClick}
            title={isPreview ? 'Click to view full thread' : ''}
          >
            {thread.title}
          </CardTitle>
          <ReplyButton serviceId={serviceId} threadId={thread.id} />
        </div>

        <PostMeta
          name={thread.name || ''}
          userId={thread.userId || ''}
          createdAt={thread.xata.createdAt}
          threadId={thread.id}
          serviceId={serviceId}
          reportedIp={thread.userIp || ''}
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
