import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { ProfileButton } from '@/components/service/ProfileButton';
import { Button } from '@/components/ui/button';
import './globals.css';

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
            <header className="sticky top-0 z-10 border-b bg-background">
              <div className="container flex items-center justify-between py-4">
                <h1 className="text-2xl font-bold">Akraft</h1>
                <nav className="flex items-center space-x-1">
                  <Button variant="ghost">About</Button>
                  <ProfileButton />
                </nav>
              </div>
            </header>
            <main className="flex-grow container py-8">{children}</main>
            <Toaster />
            <footer className="border-t bg-background">
              <div className="container py-6 text-center text-muted-foreground">
                © 2024 Akraft. All rights reserved.
              </div>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
