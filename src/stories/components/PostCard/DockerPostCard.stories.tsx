import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import PostCard from '@/app/post/view/components/postcard/docker/PostCard';
import { BasePost } from '@/app/post/view/components/postcard/BasePost';

// 모의 데이터 생성
const mockPost: BasePost = {
  id: '1',
  title: 'Docker Compose를 활용한 마이크로서비스 개발환경 구축',
  description: 'Docker Compose는 다중 컨테이너 애플리케이션을 위한 강력한 도구입니다.\n\n이 포스트에서는 마이크로서비스 아키텍처의 로컬 개발 환경을 Docker Compose로 구축하는 방법을 알아봅니다.\n\n네트워크 설정, 볼륨 관리, 환경변수 처리 등 실전 기술을 다룹니다.',
  createdAt: '2023-09-08',
  tags: ['Docker', 'DevOps', 'Microservices'],
  viewCount: 1156,
  likeCount: 127,
  topic: 'Container Orchestration',
  author: 'VanJS',
  thumbnail: '/docker.webp'
};

// PostCard 컴포넌트 래퍼
const PostCardWrapper = () => {
  return (
    <Provider store={store}>
      <div className="w-full max-w-2xl mx-auto p-4 bg-[#091b29]">
        <PostCard post={mockPost} />
      </div>
    </Provider>
  );
};

const meta: Meta = {
  title: 'stories/components/PostCard/Docker',
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
      <div className="w-full max-w-2xl mx-auto p-4 bg-[#091b29]">
        <PostCard 
          post={mockPost} 
          renderBadge={() => (
            <span className="bg-[#2496ed] text-white text-xs px-2 py-1 rounded-full">인기</span>
          )}
        />
      </div>
    </Provider>
  ),
}; 