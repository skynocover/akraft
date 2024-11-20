import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { NextRequest, NextResponse } from 'next/server';
import { Session } from 'next-auth';

import { XataClient, ServicesRecord } from '@/lib/xata/xata';

// 輔助函數：安全的 base64 編碼/解碼
const base64URLEncode = (str: string): string => {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const base64URLDecode = (str: string): string => {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
  // workers 讀取不到網址 因此需要設定nextauth url 並明示指定secret
  secret: process.env.NEXTAUTH_SECRET,

  // OAuth 需要的Edge Runtime 配置
  trustHost: true,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },

  // edge runtime 沒辦法處理crypto 因此需要明示指定session 的設定
  jwt: {
    encode: async ({ secret, token }) => {
      if (!token) return '';

      // 使用 Web Crypto API 進行加密
      const encoder = new TextEncoder();
      const payload = JSON.stringify(token);

      // 生成加密金鑰
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret as string),
        {
          name: 'HMAC',
          hash: { name: 'SHA-256' },
        },
        false,
        ['sign'],
      );

      // 簽名
      const data = encoder.encode(payload);
      const signature = await crypto.subtle.sign('HMAC', key, data);
      const signatureBase64 = base64URLEncode(
        Array.from(new Uint8Array(signature))
          .map((byte) => String.fromCharCode(byte))
          .join(''),
      );

      // 返回 JWT 格式: payload.signature
      return `${base64URLEncode(payload)}.${signatureBase64}`;
    },
    decode: async ({ secret, token }) => {
      if (!token) return null;

      try {
        const [payloadBase64] = token.split('.');
        const payload = base64URLDecode(payloadBase64);
        return JSON.parse(payload);
      } catch (error) {
        console.error('JWT decode error:', error);
        return null;
      }
    },
  },

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
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    return handler(req, res);
  });
};

export const handleRole = (handler: Function) => {
  return auth(async (req: NextAuthRequest, context: any) => {
    const serviceId = context.params.serviceId;
    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });
    const service = await xata.db.services.getFirst();
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    const isOwner = req.auth?.user?.id === service.ownerId;
    return handler(req, { ...context, xata, service, isOwner });
  });
};

export interface ServiceRoleContext {
  xata: XataClient;
  service: ServicesRecord;
  isOwner: boolean;
}
