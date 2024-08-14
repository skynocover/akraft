import { NextRequest, NextResponse } from 'next/server';
import { XataClient } from '@/lib/xata/xata';
import { handleAuth } from '@/auth';

const post = async (req: NextRequest) => {
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
};

export const POST = handleAuth(post);
