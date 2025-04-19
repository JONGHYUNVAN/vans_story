import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import PostCard from '@/app/post/view/common/postcard/nextjs/PostCard';
import { BasePost } from '@/app/post/view/common/postcard/BasePost';

// 모의 데이터 생성
const mockPost: BasePost = {
  id: '1',
  title: 'Next.js 13의 새로운 기능: App Router와 Server Components',
  description: 'Next.js 13에서 도입된 App Router는 기존의 Pages Router와 어떻게 다를까요?\n\n이 포스트에서는 App Router의 주요 기능과 Server Components의 장점에 대해 살펴봅니다.\n\n실제 프로젝트에 어떻게 적용할 수 있는지 예제 코드와 함께 설명합니다.',
  createdAt: '2023-05-15',
  tags: ['Next.js', 'React', 'Server Components'],
  viewCount: 1250,
  likeCount: 87,
  topic: 'Next.js App Router',
  author: 'VanJS',
  thumbnail: '/nextjs.webp'
};

// PostCard 컴포넌트 래퍼
const PostCardWrapper = () => {
  return (
    <Provider store={store}>
      <div className="w-full max-w-2xl mx-auto p-4 bg-gray-900">
        <PostCard post={mockPost} />
      </div>
    </Provider>
  );
};

const meta: Meta = {
  title: 'stories/components/PostCard/NextJS',
  component: PostCardWrapper,
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#121212' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', background: '#121212', minHeight: '500px', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PostCardWrapper>;

export const Default: Story = {};

export const WithCustomBadge: Story = {
  render: () => (
    <Provider store={store}>
      <div className="w-full max-w-2xl mx-auto p-4 bg-gray-900">
        <PostCard 
          post={mockPost} 
          renderBadge={() => (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">신규</span>
          )}
        />
      </div>
    </Provider>
  ),
}; 