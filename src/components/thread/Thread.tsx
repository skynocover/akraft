'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { IThread, IReply } from '@/lib/types/thread';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ThreadComponentProps {
  thread: IThread;
  isPreview: boolean;
}

const PostContent: React.FC<{ content: string }> = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    className="prose prose-sm sm:prose lg:prose-lg max-w-none break-words overflow-wrap-anywhere"
  >
    {content}
  </ReactMarkdown>
);

const MediaContent: React.FC<{
  imageToken: string | null;
  youtubeID: string | null;
}> = ({ imageToken, youtubeID }) => {
  if (imageToken) {
    return (
      <img
        src={`${imageToken}`}
        alt="Thread image"
        className="rounded-lg w-full h-auto object-cover"
      />
    );
  }
  if (youtubeID) {
    return (
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeID}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg w-full h-full"
        ></iframe>
      </div>
    );
  }
  return null;
};

const PostComponent: React.FC<{
  imageToken: string | null;
  youtubeID: string | null;
  content: string;
}> = ({ imageToken, youtubeID, content }) => (
  <div className="flex flex-col md:flex-row md:space-x-4">
    {imageToken || youtubeID ? (
      <>
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <MediaContent imageToken={imageToken} youtubeID={youtubeID} />
        </div>
        <div className="w-full md:w-1/2">
          <PostContent content={content} />
        </div>
      </>
    ) : (
      <div className="w-full md:w-2/3 mx-auto">
        <PostContent content={content} />
      </div>
    )}
  </div>
);

const PostMeta: React.FC<{
  name: string;
  userId: string;
  createdAt: Date;
  id: string;
}> = ({ name, userId, createdAt, id }) => (
  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
    <span className="font-semibold text-gray-700">{name}</span>
    <span>ID: {userId}</span>
    <span className="ml-auto">
      {createdAt.toLocaleString()} No: {id}
    </span>
  </div>
);

const ReplyComponent: React.FC<{ reply: IReply }> = ({ reply }) => (
  <div className="mt-4">
    <PostMeta
      name={reply.name}
      userId={reply.userId}
      createdAt={reply.createdAt}
      id={reply.id}
    />
    <div className="mt-2">
      <PostComponent
        imageToken={reply.imageToken}
        content={reply.content}
        youtubeID={reply.youtubeID}
      />
    </div>
  </div>
);

const ThreadComponent: React.FC<ThreadComponentProps> = ({
  thread,
  isPreview,
}) => {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const router = useRouter();
  const visibleRepliesNum = 2;
  const visibleReplies =
    isPreview && !showAllReplies
      ? thread.replies.slice(-visibleRepliesNum)
      : thread.replies;

  const handleTitleClick = () => {
    if (isPreview) {
      router.push(`/service/${thread.serviceId}/${thread.id}`);
    }
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle
          className={`text-2xl font-bold text-center mb-2 ${
            isPreview ? 'cursor-pointer hover:underline' : ''
          }`}
          onClick={handleTitleClick}
          title={isPreview ? 'Click to view full thread' : ''}
        >
          {thread.title}
        </CardTitle>
        <PostMeta
          name={thread.name}
          userId={thread.userId}
          createdAt={thread.createdAt}
          id={thread.id}
        />
      </CardHeader>
      <CardContent className="pt-3">
        <PostComponent
          content={thread.content}
          imageToken={thread.imageToken}
          youtubeID={thread.youtubeID}
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
              <React.Fragment key={reply.id}>
                {index > 0 && <Separator />}
                <ReplyComponent reply={reply} />
              </React.Fragment>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ThreadComponent;
