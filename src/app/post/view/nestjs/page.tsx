'use client';

import { useState } from 'react';
import { SiNestjs } from 'react-icons/si';
import PostCard from '../common/postcard/nestjs/PostCard';
import { useTranslation } from '@/utils/i18n';
import { FrameworkPost } from '@/types/FrameworkPost';
import { sortPosts } from '@/utils/sortPosts';
import { useSidebarMargin } from '@/hooks/useSidebarMargin';
import NestjsLayout from './NestjsLayout';

// NestjsPost 타입을 FrameworkPost를 확장하는 타입으로 정의
type NestjsPost = FrameworkPost;

const MOCK_POSTS: NestjsPost[] = [
  {
    id: '1',
    title: 'Nest.js 시작하기',
    topic: 'Nest 기초',
    description: 'Nest.js의 핵심 개념과 기본 구조를 알아봅니다.\nNest.js는 효율적이고 확장 가능한 Node.js 서버 측 애플리케이션을 구축하기 위한 프레임워크입니다.\n이 게시물에서는 모듈, 컨트롤러, 프로바이더 등 Nest.js의 핵심 개념을 실제 예제와 함께 소개하며 실전에서 활용할 수 있는 방법을 다룹니다.',
    author: 'Vans',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    tags: ['Nest.js', 'Node.js', 'Backend'],
    viewCount: 120,
    likeCount: 15,
    theme: 'backend',
    category: 'nestjs',
    thumbnail: '',
    language: 'ko'
  },
  {
    id: '2',
    title: 'Nest.js에서 데이터베이스 활용하기',
    topic: 'TypeORM',
    description: 'Nest.js에서 TypeORM을 사용하여 데이터베이스를 효율적으로 관리하는 방법을 설명합니다.\nTypeORM은 TypeScript로 작성된 ORM 라이브러리로, Nest.js와 함께 사용하면 타입 안정성과 개발 생산성을 크게 향상시킬 수 있습니다.\n\n이 게시물에서는 TypeORM을 Nest.js 프로젝트에 통합하고, 엔티티 설계, 관계 매핑, 마이그레이션 등 실무에서 필요한 데이터베이스 관리 기법을 다룹니다.',
    author: 'Vans',
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19',
    tags: ['Nest.js', 'TypeORM', 'Database'],
    viewCount: 95,
    likeCount: 10,
    theme: 'backend',
    category: 'nestjs',
    thumbnail: '',
    language: 'ko'
  }
];

export default function NestjsListPage() {
  const { t } = useTranslation('post');
  const [posts, setPosts] = useState<NestjsPost[]>(MOCK_POSTS);
  const [sortOption, setSortOption] = useState('latest');
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 커스텀 훅을 사용하여 마진 적용 여부 관리
  const { shouldApplyMargin } = useSidebarMargin();

  // 정렬 유틸리티 함수를 사용하여 정렬
  const sortedPosts = sortPosts(posts, sortOption);
  const postsToShow = sortedPosts.slice(0, visiblePosts);

  return (
    <NestjsLayout title="Nest.js">
      <div className="flex justify-end mb-8">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="text-center w-36 py-2 bg-black/50 backdrop-blur-sm text-white border border-[#333333] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#333333]"
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
              <span className="flex items-center justify-center w-10 h-8 rounded-full bg-black/50">
                <SiNestjs className="w-7 h-7 text-[#E0234E]" />
              </span>
            )}
          />
        ))}
      </div>
    </NestjsLayout>
  );
} 