'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { IThread, IReply } from '@/lib/types/thread';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ThreadComponentProps {
  thread: IThread;
}

interface IPostProps {
  imageToken: string | null;
  youtubeID: string | null;
  content: string;
}

const PostComponent: React.FC<IPostProps> = ({
  imageToken,
  youtubeID,
  content,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:space-x-4">
      {imageToken || youtubeID ? (
        <>
          <div className="w-full md:w-1/2">
            {imageToken && (
              <img
                src={`${imageToken}`}
                alt="Thread image"
                className="rounded-lg max-w-full max-h-96 object-cover"
              />
            )}
            {youtubeID && (
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeID}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg w-full h-full"
                ></iframe>
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 overflow-hidden">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </>
      ) : (
        <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

const ReplyComponent: React.FC<{ reply: IReply }> = ({ reply }) => (
  <div className="border-t border-gray-200 pt-4 mt-4">
    <div className="flex justify-between items-center mb-2">
      <p className="font-semibold">{reply.name}</p>
      <p className="text-xs text-gray-500">
        {new Date(reply.createdAt).toLocaleString()}
      </p>
    </div>
    <PostComponent
      imageToken={reply.youtubeID}
      content={reply.content}
      youtubeID={reply.youtubeID}
    />
  </div>
);

const ThreadComponent: React.FC<ThreadComponentProps> = ({ thread }) => {
  const [showAllReplies, setShowAllReplies] = useState(false);

  const visibleRepliesNum = 2;

  const visibleReplies = showAllReplies
    ? thread.replies
    : thread.replies.slice(-visibleRepliesNum); // 顯示最後幾個回覆

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2">{thread.title}</h2>
          <p className="text-sm text-gray-500">
            {thread.name} • {new Date(thread.createdAt).toLocaleString()}
          </p>
        </div>

        <PostComponent
          content={thread.content}
          imageToken={thread.imageToken}
          youtubeID={thread.youtubeID}
        />

        <div className="mt-6">
          {thread.replies.length > visibleRepliesNum && (
            <Button
              variant="ghost"
              onClick={() => setShowAllReplies(!showAllReplies)}
              className="mt-4"
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
          {visibleReplies.map((reply, index) => (
            <ReplyComponent key={reply.id} reply={reply} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreadComponent;
