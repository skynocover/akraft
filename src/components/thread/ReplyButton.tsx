'use client';
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import PostCard from './PostCard';

interface IReplyModal {
  serviceId: string;
  threadId: string;
}

export const ReplyButton: React.FC<IReplyModal> = ({ serviceId, threadId }) => {
  const [showReplyModal, setShowReplyModal] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="mb-1"
        onClick={() => setShowReplyModal(true)}
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md">
            <PostCard
              serviceId={serviceId}
              threadId={threadId}
              isReply={true}
              onClose={() => setShowReplyModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
