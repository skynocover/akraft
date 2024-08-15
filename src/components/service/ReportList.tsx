'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Trash2, ExternalLink, FileX, MessageSquareX } from 'lucide-react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ReportsRecord } from '@/lib/xata/xata';
import LoadingOverlay from '../common/LoadingOverlay';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ReportListProps {
  serviceId: string;
}

const ReportList: React.FC<ReportListProps> = ({ serviceId }) => {
  const [reports, setReports] = useState<ReportsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    if (!serviceId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/service/${serviceId}/reports`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDeleteReports = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/service/${serviceId}/reports`, {
        data: { reportIds: selectedReports },
      });
      fetchReports();
      setSelectedReports([]);
      toast({
        title: 'Success',
        description: 'Report(s) has been deleted.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting reports:', error);
    }
  };

  const handleDeleteThreadOrReply = async (report: ReportsRecord) => {
    setIsLoading(true);
    setDeletingItemId(report.id);
    try {
      if (report.reply?.id || report.thread?.id) {
        await axios.delete(`/api/service/${serviceId}/reports`, {
          data: { reportIds: [report.id], deleteAssociated: true },
        });
        toast({
          title: 'Success',
          description: 'Thread or Reply has been deleted.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Info',
          description: 'No associated thread or reply to delete.',
          variant: 'default',
        });
      }
      fetchReports();
    } catch (error) {
      console.error('Error deleting thread or reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleViewReport = (threadId: string, replyId?: string) => {
    const url = `/service/${serviceId}/${threadId}${
      replyId ? `#${replyId}` : `#${threadId}`
    }`;
    window.open(url, '_blank');
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId],
    );
  };

  const handleSelectAllReports = () => {
    setSelectedReports(
      selectedReports.length === reports.length
        ? []
        : reports.map((report) => report.id),
    );
  };

  return (
    <LoadingOverlay isLoading={isLoading}>
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="ml-1"
                        size="icon"
                        variant="destructive"
                        disabled={selectedReports.length === 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Reports</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will delete the selected report records.
                          It will not affect the associated threads or replies.
                          Are you sure you want to proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteReports}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Delete selected report records (does not affect threads or
                    replies)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedReports.length === reports.length &&
                      reports.length !== 0
                    }
                    onCheckedChange={handleSelectAllReports}
                  />
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Reporter IP</TableHead>
                <TableHead>Poster IP</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedReports.includes(report.id)}
                      onCheckedChange={() => handleSelectReport(report.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(report.xata.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{report.content}</TableCell>
                  <TableCell>{report.userIp}</TableCell>
                  <TableCell>{report.reportedIp}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            disabled={!report.thread && !report.reply}
                            onClick={() =>
                              handleViewReport(
                                report.thread?.id || '',
                                report.reply?.id || '',
                              )
                            }
                            size="icon"
                            variant="outline"
                            className="mr-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open in new tab</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="destructive"
                                disabled={
                                  deletingItemId === report.id ||
                                  (!report.thread && !report.reply)
                                }
                              >
                                {report.reply?.id ? (
                                  <MessageSquareX className="h-4 w-4" />
                                ) : (
                                  <FileX className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete {report.reply?.id ? 'Reply' : 'Thread'}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will permanently delete the{' '}
                                  {report.reply?.id ? 'reply' : 'thread'}{' '}
                                  associated with this report. Are you sure you
                                  want to proceed?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteThreadOrReply(report)
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {report.reply?.id
                              ? 'Delete Reply'
                              : 'Delete Thread'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </LoadingOverlay>
  );
};

export default ReportList;
