import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import PostCard from '@/app/post/view/common/postcard/jwt/PostCard';
import { BasePost } from '@/app/post/view/common/postcard/BasePost';

// 모의 데이터 생성
const mockPost: BasePost = {
  id: '1',
  title: 'JWT를 활용한 안전하고 확장 가능한 인증 시스템 설계',
  description: 'JSON Web Token(JWT)은 서버와 클라이언트 간 안전한 통신을 위한 토큰 기반 인증 방식입니다.\n\n이 포스트에서는 JWT의 구조, 서명 검증 방법, 토큰 관리 전략을 알아봅니다.\n\n리프레시 토큰 구현과 보안 취약점 방지 방법도 포함되어 있습니다.',
  createdAt: '2023-10-14',
  tags: ['JWT', 'Authentication', 'Security'],
  viewCount: 987,
  likeCount: 156,
  topic: 'Web Security',
  author: 'VanJS',
  thumbnail: '/jwt.webp'
};

// PostCard 컴포넌트 래퍼
const PostCardWrapper = () => {
  return (
    <Provider store={store}>
      <div className="w-full max-w-2xl mx-auto p-4 bg-[#0a0a0a]">
        <PostCard post={mockPost} />
      </div>
    </Provider>
  );
};

const meta: Meta = {
  title: 'stories/components/PostCard/JWT',
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
      <div className="w-full max-w-2xl mx-auto p-4 bg-[#0a0a0a]">
        <PostCard 
          post={mockPost} 
          renderBadge={() => (
            <span className="bg-[#1E4D2B] text-white text-xs px-2 py-1 rounded-full">보안</span>
          )}
        />
      </div>
    </Provider>
  ),
}; 