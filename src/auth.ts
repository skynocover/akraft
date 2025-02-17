import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

import { XataClient, ServicesRecord } from '@/lib/xata/xata';

export interface AuthRequest extends NextRequest {
  auth: { user: { id: string } } | null;
}

export const handleAuth = (
  handler: (req: AuthRequest, res: any) => Promise<NextResponse>,
) => {
  return async (req: AuthRequest, res: any) => {
    try {
      // 從 Authorization header 獲取 token
      const authHeader = req.headers.get('authorization');
      const accessToken = authHeader?.split(' ')[1];
      if (!authHeader || !accessToken || accessToken === 'null') {
        return handler(req, res);
      }

      const data: { id: string } = await ky
        .get('https://api.stack-auth.com/api/v1/users/me', {
          headers: {
            'X-Stack-Access-Token': accessToken,
            'X-Stack-Project-Id': process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
            'x-stack-secret-server-key': process.env.STACK_SECRET_SERVER_KEY,
            'X-Stack-Access-Type': 'server',
          },
        })
        .json();

      req.auth = { user: { id: data.id || '' } };

      return handler(req, res);
    } catch (error) {
      console.error({ error });
      return NextResponse.json(
        { error: 'Invalid session', message: error },
        { status: 401 },
      );
    }
  };
};

export const handleRole = (handler: Function) => {
  return handleAuth(async (req: AuthRequest, context: any) => {
    const serviceId = context.params.serviceId;
    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });
    const service = await xata.db.services.getFirst();
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    const isOwner = req.auth?.user?.id === service.ownerId;
    return handler(req, { ...context, xata, service, isOwner });
  });
};

export interface ServiceRoleContext {
  xata: XataClient;
  service: ServicesRecord;
  isOwner: boolean;
}
