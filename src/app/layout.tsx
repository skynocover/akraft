import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { ProfileButton } from '@/components/service/ProfileButton';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import Link from 'next/link';
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
                <Link href="/" passHref>
                  <Button variant="link" className="text-2xl font-bold p-0">
                    Akraft
                  </Button>
                </Link>
                <nav className="flex items-center space-x-2">
                  <Button variant="ghost">About</Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link
                      href="https://github.com/skynocover/akraft"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-[1.2rem] w-[1.2rem]" />
                      <span className="sr-only">GitHub</span>
                    </Link>
                  </Button>
                  <ProfileButton />
                </nav>
              </div>
            </header>
            <main className="flex-grow container py-8">{children}</main>
            <Toaster />
            <footer className="border-t bg-background">
              <div className="container py-2 text-center text-muted-foreground">
                © 2024 Akraft. All rights reserved.
              </div>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
