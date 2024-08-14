import { NextResponse } from 'next/server';

import { NextAuthRequest } from '@/auth';
import { withServiceFetch, ServiceContext } from './serviceFetch';

export const withServiceOwnerCheck = (handler: Function) => {
  return withServiceFetch(
    async (req: NextAuthRequest, context: ServiceContext) => {
      const { service } = context;
      const userId = req.auth?.user?.id || '';

      if (service.ownerId !== userId) {
        return NextResponse.json(
          { error: 'You are not owner of service' },
          { status: 400 },
        );
      }

      return handler(req, context);
    },
  );
};

export type ServiceOwnerContext = ServiceContext;
