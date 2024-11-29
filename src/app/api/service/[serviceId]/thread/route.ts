import { NextResponse } from 'next/server';
import { validatePostInput, extractYouTubeVideoId } from '@/lib/utils/threads';
import { fileToBase64, generateUserId } from '@/lib/utils/threads';
import { withPostCheck, PostCheckContext } from '@/lib/middleware/postCheck';
import { AuthRequest } from '@/auth';
import { azureContentSafety } from '@/lib/utils/azure-content-safety';

const post = async (req: AuthRequest, context: PostCheckContext) => {
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
  const ip =
    req.ip ||
    req.headers.get('X-Forwarded-For') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown';

  const userId = isOwner ? 'admin' : generateUserId(ip);

  try {
    validatePostInput(input);

    if (input.image) {
      try {
        const { isNSFW } = await azureContentSafety(
          await fileToBase64(input.image),
        );
        if (isNSFW) {
          throw new Error('NSFW_CONTENT');
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'NSFW_CONTENT') {
          return NextResponse.json(
            { error: 'Image appears to contain inappropriate content' },
            { status: 400 },
          );
        }
        console.warn(
          'Content safety check failed, proceeding without verification:',
          error,
        );
      }
    }

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
