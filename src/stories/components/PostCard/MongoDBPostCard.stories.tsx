import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import PostCard from '@/app/post/view/common/postcard/mongodb/PostCard';
import { BasePost } from '@/app/post/view/common/postcard/BasePost';

// 모의 데이터 생성
const mockPost: BasePost = {
  id: '1',
  title: 'MongoDB 아틀라스를 활용한 확장 가능한 데이터베이스 구축',
  description: 'MongoDB Atlas는 클라우드 기반 데이터베이스 서비스로 자동 확장과 백업을 제공합니다.\n\n이 포스트에서는 Atlas를 사용하여 확장 가능한 NoSQL 데이터베이스를 구축하는 방법을 알아봅니다.\n\nNode.js와 함께 사용하는 실제 예제 코드도 포함되어 있습니다.',
  createdAt: '2023-08-17',
  tags: ['MongoDB', 'NoSQL', 'Database'],
  viewCount: 864,
  likeCount: 93,
  topic: 'Database Solutions',
  author: 'VanJS',
  thumbnail: '/mongodb.webp'
};

// PostCard 컴포넌트 래퍼
const PostCardWrapper = () => {
  return (
    <Provider store={store}>
      <div className="w-full max-w-2xl mx-auto p-4 bg-[#2c1d12]">
        <PostCard post={mockPost} />
      </div>
    </Provider>
  );
};

const meta: Meta = {
  title: 'stories/components/PostCard/MongoDB',
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
      <div className="w-full max-w-2xl mx-auto p-4 bg-[#2c1d12]">
        <PostCard 
          post={mockPost} 
          renderBadge={() => (
            <span className="bg-[#00ED64] text-[#13AA52] text-xs px-2 py-1 rounded-full font-semibold">신규</span>
          )}
        />
      </div>
    </Provider>
  ),
}; 