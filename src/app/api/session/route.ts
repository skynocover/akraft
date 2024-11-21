import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/firebaseAdmin';

export async function POST(request: Request) {
  const { token } = await request.json();

  try {
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(token, { expiresIn });

    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE() {
  cookies().delete('session');
  return NextResponse.json({ status: 'success' });
}
