import { NextResponse } from 'next/server';
import { AuthRequest, ServiceRoleContext, handleRole } from '@/auth';

export const withServiceOwnerCheck = (handler: Function) => {
  return handleRole(async (req: AuthRequest, context: ServiceRoleContext) => {
    if (!context.isOwner) {
      return NextResponse.json(
        { error: 'You are not owner of service' },
        { status: 403 },
      );
    }
    return handler(req, context);
  });
};

export type ServiceOwnerContext = ServiceRoleContext;
