'use client';

import { useState } from 'react';
import { SiMariadb } from 'react-icons/si';
import PostCard from '../common/postcard/mariadb/PostCard';
import { useTranslation } from '@/utils/i18n';
import { FrameworkPost } from '@/types/FrameworkPost';
import { sortPosts } from '@/utils/sortPosts';
import { useSidebarMargin } from '@/hooks/useSidebarMargin';
import MariadbLayout from './MariadbLayout';

// MariaDBPost 타입을 FrameworkPost를 확장하는 타입으로 정의
type MariaDBPost = FrameworkPost;

const MOCK_POSTS: MariaDBPost[] = [
  {
    id: '1',
    title: 'MariaDB 시작하기',
    topic: '기초',
    description: 'MariaDB의 핵심 개념과 기본 구조를 알아봅니다.\nMariaDB는 오픈 소스 관계형 데이터베이스로, MySQL과 호환성을 제공하면서도 더 많은 기능을 제공합니다.\n이 게시물에서는 MariaDB의 설치부터 기본 명령어까지 예제와 함께 소개합니다.',
    author: 'Vans',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    tags: ['MariaDB', 'Database', 'SQL'],
    viewCount: 120,
    likeCount: 15,
    theme: 'database',
    category: 'mariadb',
    thumbnail: '',
    language: 'ko'
  },
  {
    id: '2',
    title: 'MariaDB에서 효율적인 쿼리 작성하기',
    topic: '쿼리 최적화',
    description: 'MariaDB에서 성능을 최적화하는 쿼리 작성 방법을 알아봅니다.\nMariaDB는 강력한 쿼리 최적화 기능을 제공하며, 인덱스 활용과 실행 계획 분석을 통해 성능을 크게 향상시킬 수 있습니다.\n\n이 게시물에서는 MariaDB의 쿼리 최적화 기법과 실행 계획 분석 방법을 실제 사례와 함께 설명합니다.',
    author: 'Vans',
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19',
    tags: ['MariaDB', 'Query Optimization', 'Database'],
    viewCount: 95,
    likeCount: 10,
    theme: 'database',
    category: 'mariadb',
    thumbnail: '',
    language: 'ko'
  }
];

export default function MariaDBListPage() {
  const { t } = useTranslation('post');
  const [posts, setPosts] = useState<MariaDBPost[]>(MOCK_POSTS);
  const [sortOption, setSortOption] = useState('latest');
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 커스텀 훅을 사용하여 윈도우 너비와, 마진 적용 여부 관리
  const { windowWidth, shouldApplyMargin } = useSidebarMargin();

  // 정렬 유틸리티 함수를 사용하여 정렬
  const sortedPosts = sortPosts(posts, sortOption);
  const postsToShow = sortedPosts.slice(0, visiblePosts);

  return (
    <MariadbLayout title="MariaDB">
      <div className="flex justify-end mb-8">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="text-center w-36 py-2 bg-[#003545]/50 backdrop-blur-sm text-white border border-blue-700/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#003545]"
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
              <span className="flex items-center justify-center w-10 h-8 rounded-full bg-gradient-to-br from-[#003545] to-[#00496a]">
                <SiMariadb className="w-5 h-5 text-white" />
              </span>
            )}
          />
        ))}
      </div>
    </MariadbLayout>
  );
} 