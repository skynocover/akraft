import { NextRequest, NextResponse } from 'next/server';
import { XataClient } from '@/lib/xata/xata';
import { validatePostInput, extractYouTubeVideoId } from '@/lib/utils/threads';
import { fileToBase64, generateUserId } from '@/lib/utils/threads';
import { withPostCheck, PostCheckContext } from '@/lib/middleware/postCheck';

const post = async (req: NextRequest, context: PostCheckContext) => {
  const { xata, isOwner } = context;
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const threadId = formData.get('threadId') as string;
  const content = formData.get('content') as string;
  const youtubeLink = formData.get('youtubeLink') as string;
  const image = formData.get('image') as File | null;
  const sage = formData.get('sage') === 'true';

  const input = {
    threadId,
    name,
    content,
    youtubeLink,
    image,
    sage,
  };

  const ip = req.ip || req.headers.get('X-Forwarded-For') || 'unknown';
  const userId = isOwner ? 'admin' : generateUserId(ip);

  try {
    validatePostInput(input);

    if (!threadId) {
      return NextResponse.json(
        { error: 'Thread ID is required for replies' },
        { status: 400 },
      );
    }

    const reply = await xata.db.replies.create({
      thread: threadId,
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
      sage,
      userId,
      userIp: ip,
    });

    if (!sage) {
      await xata.db.threads.update(threadId, { replyAt: new Date() });
    }

    return NextResponse.json({
      message: 'Reply created successfully',
      reply,
    });
  } catch (error) {
    console.error('Reply creation error:', error);
    return NextResponse.json(
      { error: 'Reply creation failed: ' + error },
      { status: 500 },
    );
  }
};

export const POST = withPostCheck(post);
