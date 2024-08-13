import { NextRequest, NextResponse } from 'next/server';
import { XataClient } from '@/lib/xata/xata';
import { handleAuth, NextAuthRequest } from '@/auth';

const _get = async (
  req: NextAuthRequest,
  { params }: { params: { serviceId: string } },
) => {
  const serviceId = params.serviceId;

  try {
    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });

    const reports = await xata.db.reports.getAll();
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error('Fetching reports error:', error);
    return NextResponse.json(
      { error: 'Fetching reports failed: ' + error.message },
      { status: 500 },
    );
  }
};

export const GET = handleAuth(_get);

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

const _delete = async (
  req: NextAuthRequest,
  { params }: { params: { serviceId: string } },
) => {
  const serviceId = params.serviceId;

  if (!serviceId) {
    return NextResponse.json(
      { error: 'Service ID is required' },
      { status: 400 },
    );
  }

  try {
    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });

    const body = await req.json();
    const { reportIds } = body;

    if (!Array.isArray(reportIds) || reportIds.length === 0) {
      return NextResponse.json(
        { error: 'Report IDs are required' },
        { status: 400 },
      );
    }

    await xata.db.reports.delete(reportIds);

    return NextResponse.json({
      message: 'Reports deleted successfully',
    });
  } catch (error: any) {
    console.error('Reports deletion error:', error);
    return NextResponse.json(
      { error: 'Reports deletion failed: ' + error.message },
      { status: 500 },
    );
  }
};

export const DELETE = handleAuth(_delete);
