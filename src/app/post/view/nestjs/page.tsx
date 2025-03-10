'use client';

import { useState } from 'react';
import { SiNestjs } from 'react-icons/si';
import PostCard from '../common/postcard/nestjs/PostCard';
import { useTranslation } from '@/utils/i18n';
import { FrameworkPost } from '@/types/FrameworkPost';
import { sortPosts } from '@/utils/sortPosts';
import { useSidebarMargin } from '@/hooks/useSidebarMargin';

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
  
  // 커스텀 훅을 사용하여 윈도우 너비와, 마진 적용 여부 관리
  const { windowWidth, shouldApplyMargin } = useSidebarMargin();

  // 정렬 유틸리티 함수를 사용하여 정렬
  const sortedPosts = sortPosts(posts, sortOption);
  const postsToShow = sortedPosts.slice(0, visiblePosts);

  return (
    <div className={`transition-all duration-300 ${shouldApplyMargin ? 'ml-0 lg:ml-64' : ''}`}>
      <div className="left-auto min-h-screen bg-gradient-to-br from-[#3d0415] via-[#2a0110] to-[#1a000a] relative overflow-hidden">
        {/* Nest.js 로고 패턴 */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 256 255' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid'%3E%3Cpath d='M160.227 182.262h-33.981l84.183-84.183-15.655-15.657-84.182 84.183v-33.98l99.84-99.84 15.656 15.657-65.86 65.86 65.86 65.86-15.656 15.657-50.215-50.216v36.659Z' fill='%23E0234E'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* 움직이는 그라데이션 효과 */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[#E0234E10] via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '15s' }} />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[#E0234E08] via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
        </div>
        
        {/* 글로우 효과 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[#E0234E08] blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-[#E0234E05] blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        </div>
        
        <div className="relative">
          <div className="mx-auto max-w-5xl px-6 py-12 min-h-screen border-x border-[#333333] relative">
            {/* 배경 비디오 */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/80" />
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-30"
              >
                <source src="/nestjs_background.webm" type="video/webm" />
              </video>
            </div>

            <div className="relative mb-8 pb-8 border-b border-[#333333]">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <SiNestjs className="w-8 h-8 text-[#E0234E]" />
                  <h1 className="text-2xl font-semibold text-white">Nest.js</h1>
                </div>
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
          </div>
        </div>
      </div>
    </div>
  );
} 