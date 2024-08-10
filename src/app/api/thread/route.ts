import { NextRequest, NextResponse } from 'next/server';
import { XataClient } from '@/lib/xata/xata';
import { File } from '@web-std/file';

export const config = {
  api: {
    bodyParser: false,
  },
};

const fileToBase64 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const base64String = Buffer.from(buffer).toString('base64');
  return base64String;
};

const extractYouTubeVideoId = (url: string): string | null => {
  // 定义一个正则表达式来匹配 YouTube 视频链接
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  // 使用正则表达式匹配URL
  const match = url.match(regex);

  // 如果匹配成功，返回视频ID，否则返回null
  return match ? match[1] : null;
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const serviceId = formData.get('serviceId') as string;
  const name = formData.get('name') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const youtubeID = formData.get('youtubeID') as string;
  const image = formData.get('image') as File | null;

  const xata = new XataClient({
    branch: serviceId,
    apiKey: process.env.XATA_API_KEY,
  });

  try {
    const thread = await xata.db.threads.create({
      title,
      name,
      content,
      youtubeID: youtubeID ? extractYouTubeVideoId(youtubeID) : undefined,
      image: image
        ? {
            name: encodeURIComponent(image.name),
            mediaType: image.type,
            base64Content: await fileToBase64(image),
          }
        : undefined,
      createdAt: new Date(),
      replyAt: new Date(),
    });

    return NextResponse.json({
      message: 'Thread created successfully',
      thread,
    });
  } catch (error) {
    console.error('Thread creation error:', error);
    return NextResponse.json(
      { error: 'Thread creation failed' },
      { status: 500 },
    );
  }
}
