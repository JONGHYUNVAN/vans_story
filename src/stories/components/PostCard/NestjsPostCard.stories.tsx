import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import PostCard from '@/app/post/view/common/postcard/nestjs/PostCard';
import { BasePost } from '@/app/post/view/common/postcard/BasePost';

// 모의 데이터 생성
const mockPost: BasePost = {
  id: '1',
  title: 'NestJS를 활용한 마이크로서비스 아키텍처 구현하기',
  description: 'NestJS의 모듈화된 구조는 마이크로서비스 개발에 이상적입니다.\n\n이 포스트에서는 NestJS를 사용하여 마이크로서비스를 설계하고 구현하는 방법을 단계별로 설명합니다.\n\nRabbitMQ, gRPC와의 통합 방법도 알아봅니다.',
  createdAt: '2023-06-22',
  tags: ['NestJS', 'Microservices', 'TypeScript'],
  viewCount: 935,
  likeCount: 104,
  topic: 'Backend Architecture',
  author: 'VanJS',
  thumbnail: '/nestjs.webp'
};

// PostCard 컴포넌트 래퍼
const PostCardWrapper = () => {
  return (
    <Provider store={store}>
      <div className="w-full max-w-2xl mx-auto p-4 bg-black">
        <PostCard post={mockPost} />
      </div>
    </Provider>
  );
};

const meta: Meta = {
  title: 'stories/components/PostCard/NestJS',
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
      <div className="w-full max-w-2xl mx-auto p-4 bg-black">
        <PostCard 
          post={mockPost} 
          renderBadge={() => (
            <span className="bg-[#E0234E] text-white text-xs px-2 py-1 rounded-full">인기</span>
          )}
        />
      </div>
    </Provider>
  ),
}; 