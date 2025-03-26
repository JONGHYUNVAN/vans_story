'use client';

import { useState } from 'react';
import { SiMongodb } from 'react-icons/si';
import PostCard from '../common/postcard/mongodb/PostCard';
import { useTranslation } from '@/utils/i18n';
import { FrameworkPost } from '@/types/FrameworkPost';
import { sortPosts } from '@/utils/sortPosts';
import { useSidebarMargin } from '@/hooks/useSidebarMargin';
import MongodbLayout from './MongodbLayout';

// MongoDBPost 타입을 FrameworkPost를 확장하는 타입으로 정의
type MongoDBPost = FrameworkPost;

const MOCK_POSTS: MongoDBPost[] = [
  {
    id: '1',
    title: 'MongoDB 시작하기',
    topic: '기초',
    description: 'MongoDB의 핵심 개념과 기본 구조를 알아봅니다.\nMongoDB는 문서 지향적 NoSQL 데이터베이스로, JSON과 유사한 BSON 형식으로 데이터를 저장합니다.\n이 게시물에서는 MongoDB의 설치부터 기본 명령어까지 예제와 함께 소개합니다.',
    author: 'Vans',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    tags: ['MongoDB', 'NoSQL', 'Database'],
    viewCount: 120,
    likeCount: 15,
    theme: 'database',
    category: 'mongodb',
    thumbnail: '',
    language: 'ko'
  },
  {
    id: '2',
    title: 'MongoDB 애그리게이션 파이프라인 활용하기',
    topic: '고급 쿼리',
    description: 'MongoDB의 강력한 쿼리 기능인 애그리게이션 파이프라인을 활용하는 방법을 알아봅니다.\nMongoDB의 애그리게이션 프레임워크는 데이터를 단계별로 처리하고 변환할 수 있는 유연한 방법을 제공합니다.\n\n이 게시물에서는 다양한 연산자와 표현식을 사용하여 복잡한 데이터 분석 및 처리를 수행하는 방법을 실제 사례와 함께 설명합니다.',
    author: 'Vans',
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19',
    tags: ['MongoDB', 'Aggregation', 'NoSQL'],
    viewCount: 95,
    likeCount: 10,
    theme: 'database',
    category: 'mongodb',
    thumbnail: '',
    language: 'ko'
  }
];

export default function MongoDBListPage() {
  const { t } = useTranslation('post');
  const [posts, setPosts] = useState<MongoDBPost[]>(MOCK_POSTS);
  const [sortOption, setSortOption] = useState('latest');
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 커스텀 훅을 사용하여 마진 적용 여부 관리
  const { shouldApplyMargin } = useSidebarMargin();

  // 정렬 유틸리티 함수를 사용하여 정렬
  const sortedPosts = sortPosts(posts, sortOption);
  const postsToShow = sortedPosts.slice(0, visiblePosts);

  return (
    <MongodbLayout title="MongoDB">
      <div className="flex justify-end mb-8">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="text-center w-36 py-2 bg-[#3a2617]/80 backdrop-blur-sm text-white border border-[#A67C52]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C19A6B]"
        >
          <option value="latest">{t('post.sort.latest')}</option>
          <option value="oldest">{t('post.sort.oldest')}</option>
          <option value="views">{t('post.sort.views')}</option>
          <option value="likes">{t('post.sort.likes')}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {postsToShow.map(post => (
          <PostCard
            key={post.id}
            post={post}
            renderBadge={() => (
              <span className="flex items-center justify-center w-10 h-8 rounded-full bg-gradient-to-br from-[#e5bc7a] to-[#f0d8a8]">
                <SiMongodb className="w-5 h-5 text-white" />
              </span>
            )}
          />
        ))}
      </div>
    </MongodbLayout>
  );
} 