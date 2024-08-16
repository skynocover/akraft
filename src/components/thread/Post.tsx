import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Image } from './Image';
import { ReportButton } from './ReportButton';
import { formateTime } from '@/lib/utils/dayjs';

export const PostContent: React.FC<{ content: string }> = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    className="line-break prose prose-sm sm:prose lg:prose-lg max-w-none break-words overflow-wrap-anywhere"
  >
    {content}
  </ReactMarkdown>
);

export const MediaContent: React.FC<{
  imageURL: string | null;
  youtubeID: string | null;
}> = ({ imageURL, youtubeID }) => {
  if (imageURL) {
    return (
      <div>
        <Image imageURL={imageURL} />
      </div>
    );
  }
  if (youtubeID) {
    return (
      <div className="relative w-full pt-[56.25%]">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeID}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        ></iframe>
      </div>
    );
  }
  return null;
};

export const PostComponent: React.FC<{
  imageURL: string | null;
  youtubeID: string | null;
  content: string;
}> = ({ imageURL, youtubeID, content }) => (
  <div className="flex flex-col md:flex-row md:space-x-4">
    {imageURL || youtubeID ? (
      <>
        <div className="w-full md:w-1/2 mb-4 md:mb-0 h-auto">
          <MediaContent imageURL={imageURL} youtubeID={youtubeID} />
        </div>
        <div className="w-full md:w-1/2">
          <PostContent content={content} />
        </div>
      </>
    ) : (
      <div className="w-full md:w-1/2 mx-auto">
        <PostContent content={content} />
      </div>
    )}
  </div>
);

export const PostMeta: React.FC<{
  name: string;
  userId: string;
  createdAt: Date;
  threadId?: string;
  replyId?: string;
  serviceId: string;
  reportedIp: string;
}> = ({
  name,
  userId,
  createdAt,
  threadId,
  replyId,
  serviceId,
  reportedIp,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
      <span className="font-semibold text-gray-700">{name}</span>
      <span>ID: {userId}</span>
      <span className="ml-auto flex items-center">
        {formateTime(createdAt)} No: {replyId || threadId}
        <ReportButton
          serviceId={serviceId}
          threadId={threadId}
          replyId={replyId}
          reportedIp={reportedIp}
        />
      </span>
    </div>
  );
};
