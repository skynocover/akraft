import { NextResponse } from 'next/server';
import { XataClient, ServicesRecord } from '@/lib/xata/xata';
import { NextAuthRequest } from '@/auth';

export const withServiceFetch = (handler: Function) => {
  return async (req: NextAuthRequest, context: any) => {
    const serviceId = context.params.serviceId;
    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });

    const service = await xata.db.services.getFirst();

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return handler(req, { ...context, xata, service });
  };
};

export type ServiceContext = {
  xata: XataClient;
  service: ServicesRecord;
};
