import { NextRequest, NextResponse } from 'next/server';

import { XataClient } from '@/lib/xata/xata';
import { handleAuth, NextAuthRequest } from '@/auth';
import {
  withServiceOwnerCheck,
  ServiceOwnerContext,
} from '@/lib/middleware/serviceOwnerCheck';

const _get = async (req: NextAuthRequest, context: ServiceOwnerContext) => {
  try {
    const reports = await context.xata.db.reports.getAll();
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error('Fetching reports error:', error);
    return NextResponse.json(
      { error: 'Fetching reports failed: ' + error.message },
      { status: 500 },
    );
  }
};

export const GET = handleAuth(withServiceOwnerCheck(_get));

export async function POST(
  req: NextRequest,
  { params }: { params: { serviceId: string } },
) {
  try {
    const serviceId = params.serviceId;
    const data = await req.json();

    const userIp = req.ip || req.headers.get('X-Forwarded-For') || 'unknown';
    const threadId = data.threadId as string | undefined;
    const replyId = data.replyId as string | undefined;
    const content = data.content as string | undefined;
    const reportedIp = data.reportedIp as string | undefined;

    if (!threadId) {
      return NextResponse.json(
        { error: 'Thread ID is required' },
        { status: 400 },
      );
    }

    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });

    await xata.db.reports.create({
      thread: threadId,
      reply: replyId,
      content,
      userIp,
      reportedIp,
    });

    return NextResponse.json({
      message: 'Report created successfully',
    });
  } catch (error: any) {
    console.error('Report creation error:', error);
    return NextResponse.json(
      { error: 'Report creation failed: ' + error.message },
      { status: 500 },
    );
  }
}

const _delete = async (req: NextAuthRequest, context: ServiceOwnerContext) => {
  try {
    const { xata } = context;

    const body = await req.json();
    const { reportIds, deleteAssociated = false } = body;

    if (!Array.isArray(reportIds) || reportIds.length === 0) {
      return NextResponse.json(
        { error: 'Report IDs are required' },
        { status: 400 },
      );
    }

    // Delete all associated replies
    if (deleteAssociated) {
      // Fetch all reports to be deleted
      const reportsToDelete = (await xata.db.reports.read(reportIds)).filter(
        (item) => !!item,
      );

      for (const report of reportsToDelete) {
        if (report.reply && report.thread) {
          // Case: Deleting a reply
          await xata.db.replies.delete(report.reply.id);
        } else if (report.thread && !report.reply) {
          // Case: Deleting a thread
          const relatedReplies = await xata.db.replies
            .filter({ thread: report.thread.id })
            .getAll();
          await xata.db.replies.delete(relatedReplies.map((reply) => reply.id));

          // Delete all associated reports
          const relatedReports = await xata.db.reports
            .filter({ thread: report.thread.id })
            .getAll();
          await xata.db.reports.delete(relatedReports.map((r) => r.id));

          // Delete the thread
          await xata.db.threads.delete(report.thread.id);
        }
      }
    }

    await xata.db.reports.delete(reportIds);

    return NextResponse.json({
      message: 'Reports and associated content deleted successfully',
    });
  } catch (error: any) {
    console.error('Reports deletion error:', error);
    return NextResponse.json(
      { error: 'Reports deletion failed: ' + error.message },
      { status: 500 },
    );
  }
};

export const DELETE = handleAuth(withServiceOwnerCheck(_delete));
