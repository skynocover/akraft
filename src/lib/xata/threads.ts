import { XataClient, ServicesRecord } from './xata';
import { ThreadWithReplies } from '../types/thread';

interface IGetThreads {
  serviceId: string;
}

export const getService = async ({
  serviceId,
}: IGetThreads): Promise<ServicesRecord | null> => {
  try {
    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });

    return await xata.db.services.getFirst();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getThreads = async (
  serviceId: string,
): Promise<ThreadWithReplies[]> => {
  try {
    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });

    // Fetch all threads
    const threads = await xata.db.threads.getAll();

    // Fetch related replies for each thread and transform the data
    const threadsWithReplies: ThreadWithReplies[] = await Promise.all(
      threads.map(async (thread) => {
        const replies = await xata.db.replies
          .filter({ thread: thread.id })
          .getAll();

        const transformedReplies = replies.map((reply) => ({
          ...reply,
          image: reply.image?.url,
        }));

        return {
          ...thread,
          image: thread.image?.url,
          replies: transformedReplies,
        };
      }),
    );

    return threadsWithReplies;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getThread = async ({
  serviceId,
  threadId,
}: {
  serviceId: string;
  threadId: string;
}): Promise<ThreadWithReplies | null> => {
  try {
    const xata = new XataClient({
      branch: serviceId,
      apiKey: process.env.XATA_API_KEY,
    });

    // Fetch the specific thread
    const thread = await xata.db.threads.read(threadId);
    if (!thread) {
      throw new Error(`Thread with id ${threadId} not found`);
    }

    // Fetch related replies for the thread
    const replies = await xata.db.replies
      .filter({ 'thread.id': threadId })
      .getAll();

    // Combine thread and replies
    const threadWithReplies: ThreadWithReplies = {
      ...thread,
      image: thread.image?.url,
      replies: replies.map((reply) => ({
        ...reply,
        image: reply.image?.url,
      })),
    };

    return threadWithReplies;
  } catch (error) {
    console.error('Error fetching thread with replies:', error);
    return null;
  }
};
