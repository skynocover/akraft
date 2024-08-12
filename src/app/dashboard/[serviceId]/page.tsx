import React from 'react';
import { notFound } from 'next/navigation';

import { getService } from '@/lib/xata/threads';

import ServiceEditor from '@/components/service/serviceEditor';
import ReportList from '@/components/service/ReportList';

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
    <div className="container mx-auto p-4">
      <h1 className="flex text-2xl font-bold justify-center mb-4">
        Service Management
      </h1>

      <ServiceEditor service={service} serviceId={params.serviceId} />
      <ReportList serviceId={params.serviceId} />
    </div>
  );
}
