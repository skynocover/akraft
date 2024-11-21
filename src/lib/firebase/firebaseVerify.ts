import { createRemoteJWKSet, jwtVerify } from 'jose';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export const verifyFirebaseToken = async (token: string) => {
  try {
    console.log('Verifying token...');

    const jwksUri =
      'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

    const JWKS = createRemoteJWKSet(new URL(jwksUri), {
      agent: async (url: any) => {
        const response = await fetch(url.toString());
        return await response.json();
      },
    });

    // 驗證 token
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: FIREBASE_PROJECT_ID
        ? `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`
        : undefined,
      audience: FIREBASE_PROJECT_ID || undefined,
    });

    console.log('Verification successful');
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error;
  }
};
