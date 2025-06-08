import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import PostCard from '@/app/post/view/common/postcard/algorithm/PostCard';
import { PostInfo } from "@/interfaces/post/types";

// 모의 데이터 생성
const mockPost: PostInfo = {
  id: '1',
  title: '그래프 알고리즘: 다익스트라부터 벨만-포드까지',
  description: '그래프 알고리즘은 현대 컴퓨터 과학의 핵심이 되는 중요한 개념입니다.\n\n이 포스트에서는 다익스트라(Dijkstra), 벨만-포드(Bellman-Ford), 플로이드-워셜(Floyd-Warshall) 알고리즘의 원리와 구현 방법을 알아봅니다.\n\n시간/공간 복잡도 분석과 실전 문제 해결 전략도 다룹니다.',
  createdAt: '2023-12-01',
  updatedAt: '2023-12-05',
  tags: ['Algorithm', 'Graph Theory', 'Computer Science'],
  viewCount: 845,
  likeCount: 112,
  topic: 'Algorithm Deep Dive',
  author: 'VanJS',
  thumbnail: '/algorithm.webp',
  theme: 'algorithm',
  category: 'data-structures',
  language: 'ko'
};

// PostCard 컴포넌트 래퍼
const PostCardWrapper = () => {
  return (
    <Provider store={store}>
      <div className="w-full max-w-2xl mx-auto p-4 bg-white">
        <PostCard post={mockPost} />
      </div>
    </Provider>
  );
};

const meta: Meta = {
  title: 'stories/components/PostCard/Algorithm',
  component: PostCardWrapper,
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8f8f8' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', background: '#f8f8f8', minHeight: '500px', width: '100%' }}>
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
      <div className="w-full max-w-2xl mx-auto p-4 bg-white">
        <PostCard 
          post={mockPost} 
          renderBadge={() => (
            <span className="bg-black text-white text-xs px-2 py-1 rounded-full">고급</span>
          )}
        />
      </div>
    </Provider>
  ),
}; 