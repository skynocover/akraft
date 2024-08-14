import { NextResponse } from 'next/server';
import { NextAuthRequest } from '@/auth';
import { withServiceFetch, ServiceContext } from './serviceFetch';

export const withPostCheck = (handler: Function) => {
  return withServiceFetch(
    async (req: NextAuthRequest, context: ServiceContext) => {
      const { service, xata } = context;
      const userIp = req.ip || req.headers.get('X-Forwarded-For') || 'unknown';

      const blockedIPs = service.blockedIPs || [];
      if (isIpBlocked(userIp, blockedIPs)) {
        return NextResponse.json(
          { error: `IP: ${userIp} has been blocked` },
          { status: 403 },
        );
      }

      const blockContent = service.forbidContents || [];
      const formData = await req.formData();
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;

      if (isContentBlocked(title, content, blockContent)) {
        return NextResponse.json(
          { error: 'The post contains blocked content' },
          { status: 400 },
        );
      }

      return handler(req, context);
    },
  );
};

const isIpBlocked = (ip: string, blockedIPs: string[]): boolean => {
  return blockedIPs.some((blockedIP) => {
    return ip.startsWith(blockedIP);
  });
};

const isContentBlocked = (
  title: string,
  content: string,
  blockContent: string[],
): boolean => {
  const fullText = (title + ' ' + content).toLowerCase();
  return blockContent.some((blockedWord) =>
    fullText.includes(blockedWord.toLowerCase()),
  );
};

export type PostCheckContext = ServiceContext;
