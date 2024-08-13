import React from 'react';
import { notFound } from 'next/navigation';

import { getService } from '@/lib/xata/threads';

import ServiceEditor from '@/components/service/serviceEditor';
import ReportList from '@/components/service/ReportList';
import { LogoutButton } from '@/components/service/LogoutButton';

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
    <div className="container mt-2 mx-auto space-y-6 max-w-4xl ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Service Management</h1>
        <LogoutButton />
      </div>
      <ServiceEditor service={service} />
      <ReportList serviceId={params.serviceId} />
    </div>
  );
}
