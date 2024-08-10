// Interfaces
export interface IThread {
  id: string;
  userId: string;
  title: string;
  name: string;
  content: string;
  imageToken: string;
  youtubeID: string | null;
  createdAt: Date;
  replyAt: Date;
  serviceId: string;
  replies: IReply[];
}

export interface IReply {
  id: string;
  userId: string;
  name: string;
  content: string;
  imageToken: string;
  youtubeID: string | null;
  sage: boolean;
  createdAt: Date;
  threadId: string;
}
