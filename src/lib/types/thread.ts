// Interfaces
import { XataRecord } from '@xata.io/client';

import { ThreadsRecord, RepliesRecord } from '../xata/xata';

type WithoutImage<T> = Omit<T, 'image'>;

export type ThreadWithReplies = WithoutImage<ThreadsRecord> &
  XataRecord & {
    image?: string;
    replies: (WithoutImage<RepliesRecord> & {
      image?: string;
      threadId: string;
    })[];
  };

export type IReply = WithoutImage<RepliesRecord> &
  XataRecord & {
    image?: string;
  };
