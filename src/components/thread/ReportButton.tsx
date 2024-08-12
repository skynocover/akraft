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
}

export const ReportButton: React.FC<ReportModalProps> = ({ serviceId }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('');

  const onReport = async (id: string) => {
    try {
      await axios.post('/api/report', { id, serviceId });
      console.log('Successfully reported post:', id);
    } catch (error) {
      // 處理錯誤
      console.error('Failed to report post:', error);
    }
  };

  const handleReport = () => {
    onReport(reportReason);
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

      <Dialog
        open={isReportModalOpen}
        onOpenChange={() => setIsReportModalOpen(false)}
      >
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
