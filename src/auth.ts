import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { XataClient, ServicesRecord } from '@/lib/xata/xata';

export interface FirebaseAuthRequest extends NextRequest {
  auth: { user: { id: string } } | null;
}

export const handleAuth = (
  handler: (req: FirebaseAuthRequest, res: any) => Promise<NextResponse>,
) => {
  return async (req: FirebaseAuthRequest, res: any) => {
    const supabase = createRouteHandlerClient({ cookies });

    try {
      // 從 Authorization header 獲取 token
      const authHeader = req.headers.get('authorization');
      const accessToken = authHeader?.split(' ')[1];
      if (!authHeader || !accessToken || accessToken === 'null') {
        return handler(req, res);
      }

      // 使用 access token 獲取用戶資訊
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(accessToken);

      if (error || !user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      req.auth = { user: { id: user.id } };
      return handler(req, res);
    } catch (error) {
      console.error({ error });
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
  };
};

export const handleRole = (handler: Function) => {
  return handleAuth(async (req: FirebaseAuthRequest, context: any) => {
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
