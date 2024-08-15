import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import './globals.css';

import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Akraft',
  description: 'Unleash your creativity with Akraft, your own board',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow container ">{children}</main>
            <Toaster />
            <footer className="border-t bg-background">
              <div className="container py-2 text-center text-xs text-muted-foreground">
                © 2024 Akraft. All rights reserved.{' '}
                <Link href="https://akraft.net" className="underline">
                  Visit here
                </Link>
              </div>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
