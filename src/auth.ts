import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { NextRequest, NextResponse } from 'next/server';
import { Session } from 'next-auth';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],

  logger: {
    // error: (code, ...message) => {
    //   console.error(code, message);
    // },
    // warn: (code, ...message) => {
    //   console.warn(code, JSON.stringify(message));
    // },
    // debug: (code, ...message) => {
    //   console.debug(code, JSON.stringify(message));
    // },
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.sub = `${account.provider}_${account.providerAccountId}`;
      }
      return token;
    },

    async session({ session, token, user }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}

export const handleAuth = (
  handler: (req: NextAuthRequest, res: any) => Promise<NextResponse>,
) => {
  return auth(async (req, res) => {
    if (!req.auth) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 },
      );
    }
    return handler(req, res);
  });
};
