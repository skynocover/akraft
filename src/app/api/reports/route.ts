import { NextRequest, NextResponse } from 'next/server';
import { XataClient } from '@/lib/xata/xata';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get('serviceId');

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

    const reports = await xata.db.reports.getAll();
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error('Fetching reports error:', error);
    return NextResponse.json(
      { error: 'Fetching reports failed: ' + error.message },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const userIp = req.ip || req.headers.get('X-Forwarded-For') || 'unknown';
    const serviceId = data.serviceId as string;
    const threadId = data.threadId as string | undefined;
    const replyId = data.replyId as string | undefined;
    const content = data.content as string | undefined;

    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 },
      );
    }

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

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get('serviceId');

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

    await Promise.all(reportIds.map((id) => xata.db.reports.delete(id)));

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
}
