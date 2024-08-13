import { NextRequest, NextResponse } from 'next/server';
import { XataClient } from '@/lib/xata/xata';
import { LinkItem } from '@/lib/types/link';
import { handleAuth, NextAuthRequest } from '@/auth';

const put = async (
  req: NextAuthRequest,
  { params }: { params: { serviceId: string } },
) => {
  try {
    const serviceId = params.serviceId;

    const data = await req.json();
    const name = data.name as string;
    const description = data.description as string;
    const visible = data.visible as boolean;
    const topLinks = data.topLinks as LinkItem;
    const headLinks = data.headLinks as LinkItem;
    const forbidContents = data.forbidContents as string;
    const auth = data.auth as string;

    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });

    const service = await xata.db.services.update(serviceId, {
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
      service,
    });
  } catch (error: any) {
    console.error('Service update error:', error);
    return NextResponse.json(
      { error: 'Service update failed: ' + error.message },
      { status: 500 },
    );
  }
};

export const PUT = handleAuth(put);

const _delete = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get('serviceId');

  if (!serviceId) {
    return NextResponse.json(
      { error: 'Service ID is required' },
      { status: 400 },
    );
  }

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

export const DELETE = handleAuth(_delete);
