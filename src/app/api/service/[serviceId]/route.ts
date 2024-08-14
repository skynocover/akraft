import { NextRequest, NextResponse } from 'next/server';
import { LinkItem } from '@/lib/types/link';
import { handleAuth, NextAuthRequest } from '@/auth';
import {
  withServiceOwnerCheck,
  ServiceOwnerContext,
} from '@/lib/middleware/serviceOwnerCheck';

const put = async (req: NextAuthRequest, context: ServiceOwnerContext) => {
  try {
    const { xata, service } = context;

    const data = await req.json();
    const name = data.name as string;
    const description = data.description as string;
    const visible = data.visible as boolean;
    const topLinks = data.topLinks as LinkItem;
    const headLinks = data.headLinks as LinkItem;
    const forbidContents = data.forbidContents as string;
    const auth = data.auth as string;

    await xata.db.services.update(service.id, {
      name: name.trim(),
      description,
      visible,
      topLinks: topLinks || [],
      headLinks: headLinks || [],
      forbidContents: forbidContents ? forbidContents : [],
      auth: auth || {},
    });

    return NextResponse.json({
      message: 'Service updated successfully',
    });
  } catch (error: any) {
    console.error('Service update error:', error);
    return NextResponse.json(
      { error: 'Service update failed: ' + error.message },
      { status: 500 },
    );
  }
};

export const PUT = handleAuth(withServiceOwnerCheck(put));

const _delete = async (req: NextRequest, context: ServiceOwnerContext) => {
  const { xata, service } = context;

  try {
    return NextResponse.json({
      message: 'Service deleted successfully',
    });
  } catch (error: any) {
    console.error('Service deletion error:', error);
    return NextResponse.json(
      { error: 'Service deletion failed: ' + error.message },
      { status: 500 },
    );
  }
};

export const DELETE = handleAuth(withServiceOwnerCheck(_delete));
