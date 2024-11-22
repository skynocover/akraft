import { NextResponse } from 'next/server';
import { AuthRequest, handleRole, ServiceRoleContext } from '@/auth';

export const withPostCheck = (handler: Function) => {
  return handleRole(async (req: AuthRequest, context: ServiceRoleContext) => {
    const { service, xata } = context;
    const userIp = req.ip || req.headers.get('X-Forwarded-For') || 'unknown';

    const blockedIPs = service.blockedIPs || [];
    if (isIpBlocked(userIp, blockedIPs)) {
      return NextResponse.json(
        { error: `IP: ${userIp} has been blocked` },
        { status: 403 },
      );
    }

    try {
      // workers的req.clone()還是會清空原本的req 因此要另外做
      // 讀取原始請求的 body
      const originalBody = await req.arrayBuffer();

      // 創建兩個新的請求，一個用於檢查，一個用於後續處理
      const checkRequest = new Request(req.url, {
        method: req.method,
        headers: req.headers,
        body: originalBody.slice(0),
      });

      const handlerRequest = new Request(req.url, {
        method: req.method,
        headers: req.headers,
        body: originalBody.slice(0),
      });

      const blockContent = service.forbidContents || [];
      const formData = await checkRequest.formData();
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;

      if (isContentBlocked(title, content, blockContent)) {
        return NextResponse.json(
          { error: 'The post contains blocked content' },
          { status: 400 },
        );
      }

      return handler(handlerRequest, { ...context, xata, service });
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 },
      );
    }
  });
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
