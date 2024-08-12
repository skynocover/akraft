import { NextRequest, NextResponse } from 'next/server';
import { XataClient } from '@/lib/xata/xata';

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

    if (!threadId && !replyId) {
      return NextResponse.json(
        { error: 'Thread ID or Reply ID is required' },
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
      message: 'Service updated successfully',
    });
  } catch (error: any) {
    console.error('Service update error:', error);
    return NextResponse.json(
      { error: 'Service update failed: ' + error.message },
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
    return NextResponse.json({
      message: 'Service deleted successfully',
    });
  } catch (error: any) {
    console.error('Service deletion error:', error);
    return NextResponse.json(
      { error: 'Service deletion failed: ' + error.message },
      { status: 500 },
    );
  }
}
