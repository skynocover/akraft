import { Suspense } from 'react';
import { getService, getThreads } from '@/lib/xata/threads';
import { ThreadCarousel } from '@/components/homepage/ThreadCarousel';
import { ServiceThreads } from '@/components/homepage/ServiceThreads';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { ProfileButton } from '@/components/service/ProfileButton';

export default async function Home() {
  const service = await getService({ serviceId: 'test' });
  const { threads } = await getThreads({ serviceId: 'test', pageSize: 10 });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="py-4 flex justify-between items-center mr-2">
          <h1 className="text-3xl font-bold">Akraft</h1>
          <ProfileButton />
        </div>
      </header>

      <main>
        <div className="py-8 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Latest Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading latest threads...</div>}>
                <ThreadCarousel threads={threads} />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Suspense fallback={<div>Loading service threads...</div>}>
                  <ServiceThreads
                    serviceId="test"
                    serviceName={service?.name || 'Test'}
                  />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="py-4 text-center text-muted-foreground">
          © 2024 Akraft. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
