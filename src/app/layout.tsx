import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { StackProvider, StackTheme } from '@stackframe/stack';

import { stackServerApp } from '@/lib/stack-auth/stack';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Akraft',
  description: 'Create and explore your own discussion communities',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow container ">{children}</main>
              <Toaster />
              <footer className="border-t bg-background">
                <div className="container py-2 text-center text-xs text-muted-foreground">
                  © 2024 Akraft. All rights reserved.{' '}
                  <Link
                    href="https://akraft.net"
                    target="_blank"
                    className="underline"
                  >
                    Visit here
                  </Link>
                </div>
              </footer>
            </div>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
