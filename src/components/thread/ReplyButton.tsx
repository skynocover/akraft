'use client';
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import PostCard from './PostCard';

interface IReplyModal {
  serviceId: string;
  threadId: string;
  serviceOwnerId: string;
}

export const ReplyButton: React.FC<IReplyModal> = ({
  serviceId,
  threadId,
  serviceOwnerId,
}) => {
  const [showReplyModal, setShowReplyModal] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
        onClick={() => setShowReplyModal(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md">
            <PostCard
              serviceId={serviceId}
              threadId={threadId}
              onClose={() => setShowReplyModal(false)}
              serviceOwnerId={serviceOwnerId}
            />
          </div>
        </div>
      )}
    </>
  );
};

interface IReplyNoModal {
  serviceId: string;
  threadId: string;
  replyId: string;
  serviceOwnerId: string;
}

export const ReplyNoButton: React.FC<IReplyNoModal> = ({
  serviceId,
  threadId,
  replyId,
  serviceOwnerId,
}) => {
  const [showReplyModal, setShowReplyModal] = useState(false);

  return (
    <>
      <span
        onClick={() => setShowReplyModal(true)}
        className="text-blue-300 ml-1 hover:underline cursor-pointer"
      >
        No: {replyId || threadId}
      </span>

      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md">
            <PostCard
              serviceId={serviceId}
              threadId={threadId}
              onClose={() => setShowReplyModal(false)}
              serviceOwnerId={serviceOwnerId}
              initInput={`>> ${replyId || threadId}\n`}
            />
          </div>
        </div>
      )}
    </>
  );
};
