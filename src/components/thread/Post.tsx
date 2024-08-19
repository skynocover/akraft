import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Image } from './Image';
import { ReportButton } from './ReportButton';
import { formateTime } from '@/lib/utils/dayjs';

// for scroll to No.
const extractContentFromChildren = (
  children: React.ReactNode,
): { content: string; afterNewline: any } => {
  if (
    children &&
    Array.isArray(children) &&
    React.isValidElement(children[1])
  ) {
    const element = children[1] as React.ReactElement;

    if (
      Array.isArray(element.props.children) &&
      React.isValidElement(element.props.children[1])
    ) {
      // 兩層是因為要抓到 >> 後面的數字
      const nestedElement = element.props.children[1] as React.ReactElement;
      if (typeof nestedElement.props.children === 'string') {
        const [firstLine, ...rest] = nestedElement.props.children.split('\r\n');
        return {
          content: firstLine,
          afterNewline: rest.length > 0 ? `\r\n${rest.join('\r\n')}` : '',
        };
      } else if (Array.isArray(nestedElement.props.children)) {
        // 如果下一行有文字 則要抓第二個
        if (React.isValidElement(element.props.children[1])) {
          const child = element.props.children[1] as React.ReactElement;
          return {
            content: child.props.children[0],
            afterNewline: child.props.children[1],
          };
        }
      }
    }
  }
  return { content: '', afterNewline: '' };
};

export const PostContent: React.FC<{ content: string }> = ({ content }) => {
  const handleBlockquoteClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-3xl font-bold mb-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-2xl font-semibold mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-semibold mb-2" {...props} />
        ),
        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-5 mb-4" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 mb-4" {...props} />
        ),
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        a: ({ node, href, children, ...props }) => (
          <a
            href={href}
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        blockquote: ({ node, children, ...props }) => {
          const { content, afterNewline } =
            extractContentFromChildren(children);

          if (content.startsWith('rec_')) {
            return (
              <>
                <p
                  onClick={() => handleBlockquoteClick(content)}
                  className="text-blue-500 transition-colors duration-300 hover:underline cursor-pointer"
                >
                  {'>> ' + content + '\n'}
                </p>
                {afterNewline}
              </>
            );
          }
          return (
            <blockquote
              className={`border-l-4 border-gray-300 pl-4 italic my-1`}
              {...props}
            >
              {children}
            </blockquote>
          );
        },
      }}
      className="line-break prose prose-sm sm:prose lg:prose-lg max-w-none break-words overflow-wrap-anywhere"
    >
      {content}
    </ReactMarkdown>
  );
};

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
    <div
      className="flex flex-wrap items-center gap-2 text-sm text-gray-500"
      id={replyId || threadId}
    >
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
