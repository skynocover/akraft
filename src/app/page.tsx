import { Suspense } from 'react';
import Link from 'next/link';

import { getService, getThreads } from '@/lib/xata/threads';
import { ThreadCarousel } from '@/components/homepage/ThreadCarousel';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';

const serviceIds = ['61bc09b0e27a80b99d12c095'];

export default async function Home() {
  return (
    <div className="space-y-4">
      <Header />
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-4xl">Welcome to Akraft</CardTitle>
          <CardDescription className="text-xl">
            Create and explore your own discussion communities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg">
            <Link
              href="https://forms.gle/QKvTohCXwZcjBi8V8"
              target="_blank"
              rel="noopener noreferrer"
            >
              Start Here
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div>
        <div className="space-y-6">
          {serviceIds.map(async (serviceId) => {
            const service = await getService({ serviceId });
            const { threads } = await getThreads({ serviceId, pageSize: 8 });
            return (
              <Card key={serviceId} className="w-full">
                <CardHeader>
                  <Link
                    href={`/service/${serviceId}`}
                    target="_blank"
                    key={serviceId}
                  >
                    <CardTitle>{service?.name || 'Loading...'}</CardTitle>
                  </Link>
                </CardHeader>
                <CardContent>
                  <Suspense
                    fallback={
                      <div className="text-center py-4">
                        Loading latest threads...
                      </div>
                    }
                  >
                    <ThreadCarousel threads={threads} />
                  </Suspense>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
