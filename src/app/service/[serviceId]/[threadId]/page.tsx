import React from 'react';
import { notFound } from 'next/navigation';

import TopLink from '@/components/layout/TopLink';
import Title from '@/components/layout/Title';
import ThreadComponent from '@/components/thread/Thread';
import { getThread, getService } from '@/lib/xata/threads';

export default async function Page({
  params,
}: {
  params: { threadId: string; serviceId: string };
}) {
  const thread = await getThread({
    serviceId: params.serviceId,
    threadId: params.threadId,
  });
  const service = await getService({ serviceId: params.serviceId });

  if (!thread || !service) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl relative">
      <TopLink links={service.topLinks} serviceId={params.serviceId} />
      <Title title={service.name || ''} links={service.headLinks} />
      <ThreadComponent
        serviceId={params.serviceId}
        thread={thread}
        isPreview={false}
      />
    </div>
  );
}
