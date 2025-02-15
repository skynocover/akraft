'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import { getService } from '@/lib/xata/threads';

import ServiceEditor from '@/components/service/serviceEditor';
import ReportList from '@/components/service/ReportList';
import Header from '@/components/layout/Header';
import Loading from '@/app/loading';

export default function Page({ params }: { params: { serviceId: string } }) {
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const user = useUser();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceData = await getService({ serviceId: params.serviceId });
        setService(serviceData);
      } catch (error) {
        console.error('Error fetching service:', error);
      }

      setLoading(false);
    };

    fetchService();
  }, [params.serviceId]);

  if (loading) {
    return <Loading />;
  }

  if (!service) {
    return notFound();
  }

  return (
    <div className="container mx-auto space-y-4 max-w-4xl">
      <Header />
      {service.ownerId === user?.id ? (
        <>
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
