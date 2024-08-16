import React from 'react';
import { notFound } from 'next/navigation';

import { getService } from '@/lib/xata/threads';

import ServiceEditor from '@/components/service/serviceEditor';
import ReportList from '@/components/service/ReportList';
import Header from '@/components/layout/Header';

export default async function Page({
  params,
}: {
  params: { serviceId: string };
}) {
  if (!params.serviceId) {
    return notFound();
  }
  const service = await getService({ serviceId: params.serviceId });
  if (!service) {
    return notFound();
  }
  return (
    <div className="container mx-auto space-y-4 max-w-4xl">
      <Header />
      <ServiceEditor service={service} serviceId={params.serviceId} />
      <ReportList serviceId={params.serviceId} />
    </div>
  );
}
