import { NextRequest, NextResponse } from 'next/server';
import { XataClient } from '@/lib/xata/xata';
import { validatePostInput, extractYouTubeVideoId } from '@/lib/utils/threads';
import { fileToBase64, generateUserId } from '@/lib/utils/threads';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const serviceId = formData.get('serviceId') as string;
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
      title: title || 'Untitled',
      name: name || 'anonymous',
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
