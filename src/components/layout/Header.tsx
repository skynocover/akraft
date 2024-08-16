'use client';
import { Github } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ProfileButton } from '@/components/service/ProfileButton';

export default function Header() {
  return (
    <div className="flex items-center justify-between py-4 border-b">
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
  );
}
