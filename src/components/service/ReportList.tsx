'use client';
import React, { useEffect, useState } from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
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

interface ReportListProps {
  serviceId: string;
}

const ReportList: React.FC<ReportListProps> = ({ serviceId }) => {
  const [reports, setReports] = useState<ReportsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/reports?serviceId=${serviceId}`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReports = async () => {
    try {
      await axios.delete(`/api/reports?serviceId=${serviceId}`, {
        data: { reportIds: selectedReports },
      });
      fetchReports();
      setSelectedReports([]);
    } catch (error) {
      console.error('Error deleting reports:', error);
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
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleDeleteReports}
              variant="destructive"
              disabled={selectedReports.length === 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
                  <TableCell>
                    <Button
                      onClick={() =>
                        handleViewReport(
                          report.thread?.id || '',
                          report.reply?.id || '',
                        )
                      }
                      size="icon"
                      variant="outline"
                      className="mr-2"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
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
