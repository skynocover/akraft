'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ChevronUp, MessageCircle, Flag } from 'lucide-react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import axios from 'axios';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { IReply, ThreadWithReplies } from '@/lib/types/thread';
import { Image } from './Image';
import PostCard from './PostCard';
import { Textarea } from '@/components/ui/textarea';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

dayjs.extend(localizedFormat);

interface ThreadComponentProps {
  serviceId: string;
  thread: ThreadWithReplies;
  isPreview: boolean;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (reason: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onReport,
}) => {
  const [reportReason, setReportReason] = useState<string>('');

  const handleReport = () => {
    onReport(reportReason);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Post</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Enter reason for reporting"
          value={reportReason}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setReportReason(e.target.value)
          }
          className="min-h-[100px]"
        />
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleReport} disabled={!reportReason}>
            Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
      <div>
        <Image imageURL={imageToken} />
      </div>
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
  onReport: (id: string) => void;
}> = ({ name, userId, createdAt, id, onReport }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
      <span className="font-semibold text-gray-700">{name}</span>
      <span>ID: {userId}</span>
      <span className="ml-auto flex items-center">
        {dayjs(createdAt).format('HH:mm:ss YYYY/MM/DD')} No: {id}
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 h-6 w-6"
          onClick={() => setIsReportModalOpen(true)}
          title="Report this post"
        >
          <Flag className="h-4 w-4" />
        </Button>
      </span>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReport={() => onReport(id)}
      />
    </div>
  );
};

const ReplyComponent: React.FC<{
  reply: IReply;
  onReport: (id: string) => void;
}> = ({ reply, onReport }) => (
  <div>
    <PostMeta
      name={reply.name || ''}
      userId={reply.userId || ''}
      createdAt={reply.xata.createdAt}
      id={reply.id}
      onReport={onReport}
    />
    <div className="mt-2">
      <PostComponent
        imageToken={reply.imageToken || reply.image || ''}
        content={reply.content || ''}
        youtubeID={reply.youtubeID || ''}
      />
    </div>
  </div>
);

const ThreadComponent: React.FC<ThreadComponentProps> = ({
  thread,
  isPreview,
  serviceId,
}) => {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string>();

  const router = useRouter();
  const visibleRepliesNum = 7;
  const visibleReplies =
    isPreview && !showAllReplies
      ? thread.replies.slice(-visibleRepliesNum)
      : thread.replies;

  const handleTitleClick = () => {
    if (isPreview) {
      router.push(`/service/${serviceId}/${thread.id}`);
    }
  };

  const onReport = async (id: string) => {
    try {
      await axios.post('/api/report', { id, serviceId });
      console.log('Successfully reported post:', id);
    } catch (error) {
      // 處理錯誤
      console.error('Failed to report post:', error);
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
          <Button
            variant="ghost"
            size="icon"
            className="mb-1"
            onClick={() => setShowReplyModal(true)}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>

        <PostMeta
          name={thread.name || ''}
          userId={thread.userId || ''}
          createdAt={thread.xata.createdAt}
          id={thread.id}
          onReport={onReport}
        />
      </CardHeader>
      <CardContent className="pt-3">
        <PostComponent
          content={thread.content || ''}
          imageToken={thread.imageToken || thread.image || ''}
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
                <ReplyComponent reply={reply} onReport={onReport} />
              </div>
            ))}
          </div>
        </CardFooter>
      )}

      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md">
            <PostCard
              serviceId={serviceId}
              threadId={thread.id}
              isReply={true}
              onClose={() => setShowReplyModal(false)}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default ThreadComponent;
