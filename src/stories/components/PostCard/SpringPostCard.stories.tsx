import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import PostCard from '@/app/post/view/common/postcard/spring/PostCard';
import { BasePost } from '@/app/post/view/common/postcard/BasePost';

// 모의 데이터 생성
const mockPost: BasePost = {
  id: '1',
  title: 'Spring Boot 3.2의 새로운 기능과 향상된 성능',
  description: 'Spring Boot 3.2 버전은 Java 21의 가상 스레드(Virtual Threads)를 지원합니다.\n\n이 포스트에서는 Spring Boot 3.2의 주요 기능과 성능 향상점을 알아봅니다.\n\n실제 프로젝트 마이그레이션 가이드도 포함되어 있습니다.',
  createdAt: '2023-11-05',
  tags: ['Spring Boot', 'Java', 'Backend'],
  viewCount: 1042,
  likeCount: 78,
  topic: 'Spring Framework',
  author: 'VanJS',
  thumbnail: '/spring.webp'
};

// PostCard 컴포넌트 래퍼
const PostCardWrapper = () => {
  return (
    <Provider store={store}>
      <div className="w-full max-w-2xl mx-auto p-4 bg-[#1c1f23]">
        <PostCard post={mockPost} />
      </div>
    </Provider>
  );
};

const meta: Meta = {
  title: 'stories/components/PostCard/Spring',
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
      <div className="w-full max-w-2xl mx-auto p-4 bg-[#1c1f23]">
        <PostCard 
          post={mockPost} 
          renderBadge={() => (
            <span className="bg-[#6DB33F] text-white text-xs px-2 py-1 rounded-full">인기</span>
          )}
        />
      </div>
    </Provider>
  ),
}; 