import { ReactNode } from 'react';

import { notFound } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
  params: {
    serviceId: string;
  };
}

export default function Layout({ children, params }: LayoutProps) {
  const { serviceId } = params;

  if (serviceId === 'main') {
    notFound();
  }

  return <>{children}</>;
}
