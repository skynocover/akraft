import { verifyFirebaseToken } from '@/lib/firebase/firebaseVerify';

export async function POST(request: Request) {
  const { token } = await request.json();

  try {
    const isValid = await verifyFirebaseToken(token);
    if (!isValid) {
      throw new Error('Invalid token');
    }

    const expiresIn = 60 * 60 * 24 * 7; // 7 days in seconds

    // 設定 cookie
    return new Response(JSON.stringify({ status: 'success' }), {
      headers: {
        'Set-Cookie': `session=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${expiresIn}; Path=/`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function DELETE() {
  return new Response(JSON.stringify({ status: 'success' }), {
    headers: {
      'Set-Cookie':
        'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/',
      'Content-Type': 'application/json',
    },
  });
}
