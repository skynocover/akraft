import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase/firebaseVerify';

import { XataClient, ServicesRecord } from '@/lib/xata/xata';

export interface FirebaseAuthRequest extends NextRequest {
  auth: { user: { id: string } } | null;
}

export const handleAuth = (
  handler: (req: FirebaseAuthRequest, res: any) => Promise<NextResponse>,
) => {
  return async (req: FirebaseAuthRequest, res: any) => {
    const sessionCookie = req.cookies.get('session');
    if (!sessionCookie) {
      return handler(req, res);
    }

    try {
      const payload: any = await verifyFirebaseToken(sessionCookie.value);
      if (!payload) {
        throw new Error('Invalid session');
      }
      req.auth = { user: { id: payload.sub || '' } };
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
