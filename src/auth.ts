import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/firebaseAdmin';

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
      const decodedClaims = await auth.verifySessionCookie(
        sessionCookie.value,
        true,
      );
      req.auth = { user: { id: decodedClaims.uid } };
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
