import { NextResponse } from 'next/server';
import { NextAuthRequest, handleRole, ServiceRoleContext } from '@/auth';

export const withPostCheck = (handler: Function) => {
  return handleRole(
    async (req: NextAuthRequest, context: ServiceRoleContext) => {
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
      const formData = await req.clone().formData(); // req是一個可以被消耗的 所以要加上clone
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;

      if (isContentBlocked(title, content, blockContent)) {
        return NextResponse.json(
          { error: 'The post contains blocked content' },
          { status: 400 },
        );
      }

      return handler(req, { ...context, xata, service });
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

export type PostCheckContext = ServiceRoleContext;
