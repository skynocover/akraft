import { NextResponse } from 'next/server';
import { validatePostInput, extractYouTubeVideoId } from '@/lib/utils/threads';
import { fileToBase64, generateUserId } from '@/lib/utils/threads';
import { withPostCheck, PostCheckContext } from '@/lib/middleware/postCheck';
import { NextAuthRequest } from '@/auth';

const post = async (req: NextAuthRequest, context: PostCheckContext) => {
  const { xata, isOwner } = context;
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const youtubeLink = formData.get('youtubeLink') as string;
  const image = formData.get('image') as File | null;
  const input = {
    title,
    name,
    content,
    youtubeLink: youtubeLink,
    image,
  };
  const ip = req.ip || req.headers.get('X-Forwarded-For') || 'unknown';

  const userId = isOwner ? 'admin' : generateUserId(ip);

  try {
    validatePostInput(input);

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
};

export const POST = withPostCheck(post);
