import { NextRequest, NextResponse } from 'next/server';
import { XataClient } from '@/lib/xata/xata';
import { validatePostInput, extractYouTubeVideoId } from '@/lib/utils/threads';
import { fileToBase64, generateUserId } from '@/lib/utils/threads';
import { handleAuth, NextAuthRequest } from '@/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { serviceId: string } },
) {
  const serviceId = params.serviceId;
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const youtubeLink = formData.get('youtubeLink') as string;
  const image = formData.get('image') as File | null;
  const input = {
    serviceId,
    title,
    name,
    content,
    youtubeLink: youtubeLink,
    image,
  };
  const ip = req.ip || req.headers.get('X-Forwarded-For') || 'unknown';
  const userId = generateUserId(ip);

  try {
    validatePostInput(input);
    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });
    const thread = await xata.db.threads.create({
      title: title.trim() || 'Untitled',
      name: name.trim() || 'anonymous',
      content,
      youtubeID: youtubeLink ? extractYouTubeVideoId(youtubeLink) : undefined,
      image: image
        ? {
            name: encodeURIComponent(image.name),
            mediaType: image.type,
            base64Content: await fileToBase64(image),
            enablePublicUrl: true,
          }
        : undefined,
      replyAt: new Date(),
      userId,
      userIp: ip,
    });
    return NextResponse.json({
      message: 'Thread created successfully',
      thread,
    });
  } catch (error) {
    console.error('Thread creation error:', error);
    return NextResponse.json(
      { error: 'Thread creation failed' + error },
      { status: 500 },
    );
  }
}

const _delete = async (
  req: NextAuthRequest,
  { params }: { params: { serviceId: string } },
) => {
  const serviceId = params.serviceId;
  const threadId = req.nextUrl.searchParams.get('threadId');
  if (!threadId) {
    return NextResponse.json(
      { error: 'Thread ID are required' },
      { status: 400 },
    );
  }

  try {
    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });
    // 獲取所有關聯的回覆
    const relatedReplies = await xata.db.replies
      .filter({ thread: threadId })
      .getMany();
    await xata.db.replies.delete(relatedReplies);
    await xata.db.threads.delete(threadId);
    return NextResponse.json({
      message: 'Thread and related replies deleted successfully',
    });
  } catch (error) {
    console.error('Thread deletion error:', error);
    return NextResponse.json(
      { error: 'Thread deletion failed: ' + error },
      { status: 500 },
    );
  }
};

export const DELETE = handleAuth(_delete);
