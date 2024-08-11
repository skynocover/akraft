import { NextRequest, NextResponse } from 'next/server';
import { XataClient } from '@/lib/xata/xata';
import { LinkItem } from '@/lib/types/link';

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const visible = formData.get('visible') === 'true';
  const topLinks = formData.get('topLinks') as string;
  const headLinks = formData.get('headLinks') as string;
  const forbidContents = formData.get('forbidContents') as string;
  const auth = formData.get('auth') as string;

  try {
    const xata = new XataClient({
      apiKey: process.env.XATA_API_KEY,
    });

    const service = await xata.db.services.create({
      name: name.trim(),
      description,
      visible,
      topLinks: JSON.parse(topLinks || '[]'),
      headLinks: JSON.parse(headLinks || '[]'),
      forbidContents: forbidContents ? forbidContents.split(',') : [],
      auth: JSON.parse(auth || '{}'),
    });

    return NextResponse.json({
      message: 'Service created successfully',
      service,
    });
  } catch (error: any) {
    console.error('Service creation error:', error);
    return NextResponse.json(
      { error: 'Service creation failed: ' + error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();

    const id = data.id as string;
    const serviceId = data.serviceId as string;
    const name = data.name as string;
    const description = data.description as string;
    const visible = data.visible as boolean;
    const topLinks = data.topLinks as LinkItem;
    const headLinks = data.headLinks as LinkItem;
    const forbidContents = data.forbidContents as string;
    const auth = data.auth as string;

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 },
      );
    }

    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });

    const service = await xata.db.services.update(id, {
      name: name.trim(),
      description,
      visible,
      topLinks: topLinks || [],
      headLinks: headLinks || [],
      forbidContents: forbidContents ? forbidContents : [],
      auth: auth || {},
    });

    console.log({ service });

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
}

export async function DELETE(req: NextRequest) {
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
}
