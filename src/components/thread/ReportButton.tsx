'use client';
import React, { useState } from 'react';

import { Flag } from 'lucide-react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ReportModalProps {
  serviceId: string;
  threadId?: string;
  replyId?: string;
}

export const ReportButton: React.FC<ReportModalProps> = ({
  serviceId,
  threadId,
  replyId,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('');

  const onReport = async (content: string) => {
    try {
      await axios.post('/api/reports', {
        content,
        serviceId,
        threadId,
        replyId,
      });
    } catch (error) {
      console.error('Failed to report post:', error);
    }
  };

  const handleReport = () => {
    onReport(reportReason);
    handleClose();
  };

  const handleClose = () => {
    setReportReason('');
    setIsReportModalOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="ml-2 h-6 w-6"
        onClick={() => setIsReportModalOpen(true)}
        title="Report this post"
      >
        <Flag className="h-4 w-4" />
      </Button>

      <Dialog open={isReportModalOpen} onOpenChange={handleClose}>
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
            <Button
              onClick={() => setIsReportModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleReport} disabled={!reportReason}>
              Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
