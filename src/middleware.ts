import { NextResponse } from 'next/server';
import { NextAuthRequest, auth } from '@/auth';

export default auth(async (request: NextAuthRequest) => {
  const auth = request.auth;

  const isAuth = !!auth?.user?.email;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return;
  }

  if (!isAuth) {
    const from = request.nextUrl.pathname + request.nextUrl.search;
    request.nextUrl.pathname = '/api/auth/signin';
    request.nextUrl.searchParams.set('callbackUrl', from);
    return NextResponse.redirect(request.nextUrl);
  }
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
