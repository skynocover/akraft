import crypto from 'crypto';

export interface PostInput {
  threadId?: string; //Reply才會有
  title?: string;
  name?: string;
  content?: string;
  youtubeLink?: string;
  image?: File | null;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const validatePostInput = (input: PostInput) => {
  const contentFilled = !!input.content || input.content?.trim() !== '';
  const youtubeLinkFilled = !!input.youtubeLink;
  const imageFilled = !!input.image;

  if (!contentFilled && !youtubeLinkFilled && !imageFilled) {
    throw new Error(
      'At least one of Content, YouTube Link, or Image must be provided',
    );
  }

  if (youtubeLinkFilled && imageFilled) {
    throw new Error(
      'You can only provide either a YouTube Link or an Image, not both',
    );
  }

  if (input.image) {
    if (input.image.size > MAX_IMAGE_SIZE) {
      throw new Error('Image size exceeds the limit');
    }
    if (!input.image.type.startsWith('image/')) {
      throw new Error('Only accept image');
    }
  }

  if (youtubeLinkFilled) {
    const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    const extractedId = extractYouTubeVideoId(input.youtubeLink!);
    if (!extractedId || !youtubeIdRegex.test(extractedId)) {
      throw new Error('Invalid YouTube Link');
    }
  }

  return;
};

export const extractYouTubeVideoId = (url: string): string | null => {
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const fileToBase64 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const base64String = Buffer.from(buffer).toString('base64');
  return base64String;
};

export const generateUserId = (ip: string): string => {
  const key =
    process.env.USER_ID_SECRET_KEY ||
    'ccf721ebbbfd4aabfb0c101ae1df46a585c945b75ecf92640807cab55902c858';
  const hash = crypto.createHash('sha256');
  hash.update(ip + key);
  return hash.digest('hex').substring(0, 13);
};
