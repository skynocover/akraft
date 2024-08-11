'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExternalLink } from 'lucide-react';
import { LinkItem } from '@/lib/types/link';

interface TopLinkProps {
  serviceId: string;
  links: LinkItem[];
}

export default function TopLink({ serviceId, links }: TopLinkProps) {
  return (
    <div className="absolute top-2 right-2 flex items-center space-x-2 text-xs">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          className="text-gray-400 hover:text-gray-600 flex items-center"
        >
          {link.name} <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      ))}
      <a
        key={'manage link'}
        href={`/service?serviceId=${serviceId}`}
        target="_blank"
        className="text-gray-400 hover:text-gray-600 flex items-center"
      >
        {'Admin'} <ExternalLink className="ml-1 h-3 w-3" />
      </a>
      <Select defaultValue={'en'}>
        <SelectTrigger className="w-[80px] h-6 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">EN</SelectItem>
          <SelectItem value="zh">中文</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
