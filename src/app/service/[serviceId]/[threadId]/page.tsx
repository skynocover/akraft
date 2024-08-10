import React from 'react';

import PostCard from '@/components/thread/PostCard';

import TopLink from '@/components/layout/TopLink';
import Title from '@/components/layout/Title';
import { LinkItem } from '@/lib/types/link';
import Pagination from '@/components/layout/Pagination';
import ThreadComponent from '@/components/thread/Thread';
import { IThread, IReply } from '@/lib/types/thread';

async function getThreads(): Promise<IThread[]> {
  return [
    {
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
          imageToken: 'https://picsum.photos/400/300',
          youtubeID: null,
          createdAt: new Date('2024-08-09 15:07:00'),
          threadId: 'thread_03',
          sage: false,
        },
        {
          id: 'reply_06',
          userId: 'user_09',
          name: 'CodeRefactor',
          content: `
            當然，別忘了還有 **模組化** 和 **Promise** 的使用：
  
            \`\`\`javascript
            import { myFunction } from './myModule';
            
            myFunction()
              .then(result => console.log(result))
              .catch(error => console.error(error));
            \`\`\`
          `,
          imageToken: 'https://picsum.photos/400/300',
          youtubeID: null,
          createdAt: new Date('2024-08-09 15:08:00'),
          threadId: 'thread_03',
          sage: false,
        },
      ],
    },
    {
      id: 'thread_01',
      userId: 'user_01',
      title: 'Markdown 基本使用介紹',
      name: 'MarkdownLover',
      content: `
        **Markdown** 是一種輕量級標記語言，用於格式化純文本。以下是一些常用的語法：
  
        - **粗體**: 使用 \`**\` 包裹文字。
        - *斜體*: 使用 \`*\` 包裹文字。
        - [連結](https://example.com): 使用 \`[描述](連結)\` 來創建連結。
        
        1. 項目一
        2. 項目二
        3. 項目三
  
        \`\`\`javascript
        console.log('Hello, World!');
        \`\`\`
      `,
      imageToken: '',
      youtubeID: 'dQw4w9WgXcQ',
      createdAt: new Date('2024-08-09 14:00:00'),
      replyAt: new Date('2024-08-09 14:10:00'),
      serviceId: 'service_01',
      replies: [
        {
          id: 'reply_01',
          userId: 'user_02',
          name: 'CodeMaster',
          content: `
            我也喜歡使用 **Markdown**，特別是當我在寫 \`code blocks\` 的時候：
  
            \`\`\`python
            def hello_world():
                print("Hello, World!")
            \`\`\`
          `,
          imageToken: '',
          youtubeID: null,
          createdAt: new Date('2024-08-09 14:12:00'),
          threadId: 'thread_01',
          sage: false,
        },
      ],
    },
  ];
}

interface Service {
  title: string;
  description: string;
  titleLinks: LinkItem[];
  topLinks: LinkItem[];
}

async function getService(): Promise<Service> {
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

export default async function Page() {
  const threads = await getThreads();
  const service = await getService();

  return (
    <div className="container mx-auto p-6 max-w-4xl relative">
      <TopLink links={service.topLinks} />
      <Title title={service.title} links={service.titleLinks} />
      <PostCard markdownInfo={service.description} />
      <Pagination totalPages={10} currentPage={1} baseUrl={''} />
      {threads.map((thread) => (
        <ThreadComponent key={thread.id} thread={thread} />
      ))}
      <Pagination totalPages={10} currentPage={1} baseUrl={''} />
    </div>
  );
}
