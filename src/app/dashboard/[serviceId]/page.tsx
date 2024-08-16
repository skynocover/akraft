import React from 'react';
import { notFound } from 'next/navigation';

import { getService } from '@/lib/xata/threads';

import ServiceEditor from '@/components/service/serviceEditor';
import ReportList from '@/components/service/ReportList';
import Header from '@/components/layout/Header';
import { auth } from '@/auth';

export default async function Page({
  params,
}: {
  params: { serviceId: string };
}) {
  const service = await getService({ serviceId: params.serviceId });
  if (!service) {
    return notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div className="container mx-auto space-y-4 max-w-4xl">
      <Header />
      {service.ownerId === userId ? (
        <>
          {' '}
          <ServiceEditor service={service} serviceId={params.serviceId} />
          <ReportList serviceId={params.serviceId} />
        </>
      ) : (
        <>
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error：</strong>
            <span className="block sm:inline">
              You are not the owner of this service。
            </span>
          </div>
        </>
      )}
    </div>
  );
}
