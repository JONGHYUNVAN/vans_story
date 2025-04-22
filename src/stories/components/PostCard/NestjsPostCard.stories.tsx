import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import PostCard from '@/app/post/view/common/postcard/nestjs/PostCard';
import { BasePost } from '@/app/post/view/common/postcard/BasePost';

// 목업 데이터
const mockPost: BasePost = {
  id: '1',
  title: 'NestJS로 마이크로서비스 아키텍처 구현하기',
  description: 'NestJS를 활용하여 확장 가능한 마이크로서비스 아키텍처를 구현하는 방법을 알아봅니다.\n\n이 포스트에서는 NestJS의 모듈화된 구조와 마이크로서비스 통신 패턴을 활용하여 대규모 애플리케이션을 설계하는 방법을 설명합니다.',
  createdAt: '2023-11-15',
  tags: ['NestJS', 'Microservices', 'TypeScript'],
  viewCount: 1240,
  likeCount: 89,
  topic: '백엔드 아키텍처',
  author: '김개발',
  thumbnail: '/nestjs.webp'
};

// PostCard를 감싸는 컴포넌트
const PostCardWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <div className="w-[400px] p-4 bg-zinc-900">
      {children}
    </div>
  </Provider>
);

// 스토리북 메타데이터
const meta: Meta<typeof PostCard> = {
  title: 'stories/components/PostCard/NestJS',
  component: PostCard,
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#171717' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <PostCardWrapper>
        <Story />
      </PostCardWrapper>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PostCard>;

// 기본 스토리
export const Default: Story = {
  args: {
    post: mockPost,
  },
};

// 커스텀 배지가 있는 스토리
export const WithCustomBadge: Story = {
  args: {
    post: {
      ...mockPost,
      title: 'NestJS와 GraphQL로 API 구축하기',
      description: 'NestJS와 GraphQL을 활용하여 강력한 API를 구축하는 방법을 알아봅니다.\n\n이 포스트에서는 타입 세이프한 스키마 정의와 리졸버 구현 방법에 대해 자세히 설명합니다.',
      tags: ['NestJS', 'GraphQL', 'API'],
      topic: 'API 개발',
    },
    renderBadge: (post) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        인기
      </span>
    ),
  },
}; 