import Link from 'next/link';
import { LinkItem } from '@/lib/types/link';
import GoogleAd from '@/components/layout/GoogleAd';

interface TitleProps {
  title: string;
  links: LinkItem[];
}

export default function Title({ title, links }: TitleProps) {
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-2 mt-6 text-black">
        {title}
      </h1>
      <div className="flex justify-center mb-2 space-x-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            passHref
            target="_blank"
            className="text-blue-500 text-md py-1 px-2 rounded shadow-md border-2 border-blue-400 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition duration-300"
          >
            {link.name}
          </Link>
        ))}
      </div>
      <GoogleAd />
    </>
  );
}
