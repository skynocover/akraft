'use client';
import Link from 'next/link';

import { LinkItem } from '@/lib/types/link';

interface TitleProps {
  title: string;
  links: LinkItem[];
}

export default function Title({ title, links }: TitleProps) {
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-2 mt-8">{title}</h1>
      <div className="flex justify-center mb-4 space-x-1">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            passHref
            target="_blank"
            className="text-black text-md py-1 px-2 rounded shadow-md border-2 border-blue-500 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition duration-300"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </>
  );
}
