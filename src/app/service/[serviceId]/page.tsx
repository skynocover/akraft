import React from 'react';
import { notFound } from 'next/navigation';
import PostCard from '@/components/thread/PostCard';
import TopLink from '@/components/layout/TopLink';
import Title from '@/components/layout/Title';
import Pagination from '@/components/layout/Pagination';
import ThreadComponent from '@/components/thread/Thread';
import { getService, getThreads } from '@/lib/xata/threads';

export default async function Page({
  params,
  searchParams,
}: {
  params: { serviceId: string };
  searchParams: { page?: string };
}) {
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const pageSize = 10;

  const { threads, totalPages } = await getThreads({
    serviceId: params.serviceId,
    page: currentPage,
    pageSize,
  });

  const service = await getService({ serviceId: params.serviceId });

  if (!service) {
    return notFound();
  }

  const baseUrl = `/service/${params.serviceId}`;

  return (
    <div className="container mx-auto p-6 max-w-4xl relative">
      <TopLink links={service.topLinks || []} />
      <Title title={service.name || ''} links={service.headLinks || []} />
      <PostCard
        serviceId={params.serviceId}
        description={service.description || ''}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        baseUrl={baseUrl}
      />
      {threads.map((thread) => (
        <ThreadComponent
          key={thread.id}
          serviceId={params.serviceId}
          thread={thread}
          isPreview={true}
        />
      ))}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        baseUrl={baseUrl}
      />
    </div>
  );
}
