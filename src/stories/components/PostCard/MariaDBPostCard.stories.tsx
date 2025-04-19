import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import PostCard from '@/app/post/view/common/postcard/mariadb/PostCard';
import { BasePost } from '@/app/post/view/common/postcard/BasePost';

// 모의 데이터 생성
const mockPost: BasePost = {
  id: '1',
  title: 'MariaDB 고가용성 클러스터 구축 가이드',
  description: 'MariaDB는 오픈소스 관계형 데이터베이스로 MySQL과 호환성이 뛰어납니다.\n\n이 포스트에서는 MariaDB Galera 클러스터를 활용한 고가용성 아키텍처 구축 방법을 설명합니다.\n\n다중 마스터 복제, 자동 장애 조치 설정을 위한 단계별 가이드를 제공합니다.',
  createdAt: '2023-07-12',
  tags: ['MariaDB', 'Database', 'High Availability'],
  viewCount: 742,
  likeCount: 68,
  topic: 'Database Architecture',
  author: 'VanJS',
  thumbnail: '/mariadb.webp'
};

// PostCard 컴포넌트 래퍼
const PostCardWrapper = () => {
  return (
    <Provider store={store}>
      <div className="w-full max-w-2xl mx-auto p-4 bg-[#1A2024]">
        <PostCard post={mockPost} />
      </div>
    </Provider>
  );
};

const meta: Meta = {
  title: 'stories/components/PostCard/MariaDB',
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
      <div className="w-full max-w-2xl mx-auto p-4 bg-[#1A2024]">
        <PostCard 
          post={mockPost} 
          renderBadge={() => (
            <span className="bg-[#003545] text-white text-xs px-2 py-1 rounded-full">추천</span>
          )}
        />
      </div>
    </Provider>
  ),
}; 