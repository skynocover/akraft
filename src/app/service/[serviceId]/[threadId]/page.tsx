import React from 'react';
import TopLink from '@/components/layout/TopLink';
import Title from '@/components/layout/Title';
import { LinkItem } from '@/lib/types/link';
import ThreadComponent from '@/components/thread/Thread';
import { IThread } from '@/lib/types/thread';

async function getThread(threadId: string): Promise<IThread> {
  // Fetch thread data from your API or database
  // This is a placeholder implementation
  return {
    id: 'thread_03',
    userId: 'user_06',
    title: '學習 JavaScript 的一些技巧',
    name: 'JSNerd',
    content: `在學習 **JavaScript** 時，以下這些技巧可能會對你有幫助：\n1. 善用 **let** 和 **const** 來取代 **var**。
        2. 使用 **箭頭函數** 來簡化函數定義：
           \`\`\`javascript
           const sum = (a, b) => a + b;
           \`\`\`
        3. 使用 **模板字面量** 來更簡潔地拼接字串：
           \`\`\`javascript
           const name = "John";
           console.log(\`Hello, \${name}!\`);
           \`\`\`
      `,
    imageToken: ' https://picsum.photos/400/300 ',
    youtubeID: null,
    createdAt: new Date('2024-08-09 15:00:00'),
    replyAt: new Date('2024-08-09 15:10:00'),
    serviceId: 'service_03',
    replies: [
      {
        id: 'reply_04',
        userId: 'user_07',
        name: 'JSLearner',
        content: `謝謝分享！我發現模板字面量真的是太好用了，可以讓我的代碼看起來更清晰。
  
            > **提示**: 記住用 \`\${}\` 來嵌入變量。
          `,
        imageToken: 'https://picsum.photos/400/300',
        youtubeID: null,
        createdAt: new Date('2024-08-09 15:05:00'),
        threadId: 'thread_03',
        sage: false,
      },
      {
        id: 'reply_05',
        userId: 'user_08',
        name: 'ES6Fan',
        content: `
            同時還可以使用 **解構賦值** 來簡化對象的處理：
  
            \`\`\`javascript
            const { name, age } = person;
            \`\`\`
          `,
        imageToken: '',
        youtubeID: null,
        createdAt: new Date('2024-08-09 15:07:00'),
        threadId: 'thread_03',
        sage: false,
      },
    ],
  };
}

interface Service {
  title: string;
  description: string;
  titleLinks: LinkItem[];
  topLinks: LinkItem[];
}

async function getService(): Promise<Service> {
  // Fetch service data from your API or database
  // This is a placeholder implementation
  return {
    title: '影視版',
    description:
      '內文可以使用Markdown語法\n如果需要換行記得每行最後面加上兩個空白',
    titleLinks: [
      { name: 'aa', url: '' },
      { name: 'bb', url: '' },
    ],
    topLinks: [{ name: 'Komica', url: '' }],
  };
}

export default async function Page({
  params,
}: {
  params: { threadId: string };
}) {
  const thread = await getThread(params.threadId);
  const service = await getService();

  return (
    <div className="container mx-auto p-6 max-w-4xl relative">
      <TopLink links={service.topLinks} />
      <Title title={service.title} links={service.titleLinks} />
      <ThreadComponent thread={thread} isPreview={false} />
    </div>
  );
}
