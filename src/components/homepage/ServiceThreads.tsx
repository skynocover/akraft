import Link from 'next/link';

import { getThreads } from '@/lib/xata/threads';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formateTime } from '@/lib/utils/dayjs';

interface ServiceThreadsProps {
  serviceId: string;
  serviceName: string;
}

export const ServiceThreads: React.FC<ServiceThreadsProps> = async ({
  serviceId,
  serviceName,
}) => {
  const { threads } = await getThreads({ serviceId, pageSize: 5 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{serviceName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {threads.map((thread) => (
            <li key={thread.id}>
              <Link
                href={`/service/${serviceId}/${thread.id}`}
                className="block hover:bg-accent p-2 rounded"
              >
                <h4 className="font-medium truncate">{thread.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {formateTime(thread.xata.createdAt)} • {thread.replies.length}{' '}
                  replies
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <Button asChild variant="link" className="mt-4">
          <Link target="_blank" href={`/service/${serviceId}`}>
            View all threads →
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
