'use client';

import { useState } from 'react';
import { SiNextdotjs } from 'react-icons/si';
import PostCard from '../common/postcard/nextjs/PostCard';
import { useTranslation } from '@/utils/i18n';
import { FrameworkPost } from '@/types/FrameworkPost';
import { sortPosts } from '@/utils/sortPosts';
import { useSidebarMargin } from '@/hooks/useSidebarMargin';

// NextjsPost 타입을 FrameworkPost를 확장하는 타입으로 정의
type NextjsPost = FrameworkPost;

const MOCK_POSTS: NextjsPost[] = [
  {
    id: '1',
    title: 'Next.js 시작하기',
    topic: '기초',
    description: 'Next.js의 핵심 개념과 기본 구조를 알아봅니다.\nNext.js는 React 기반의 풀스택 웹 프레임워크로, 서버 사이드 렌더링, 정적 사이트 생성 등 다양한 렌더링 방식을 제공합니다.\n이 게시물에서는 Next.js의 특징과 기본 구조, 라우팅 시스템을 예제와 함께 소개합니다.',
    author: 'Vans',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    tags: ['Next.js', 'React', 'Frontend'],
    viewCount: 120,
    likeCount: 15,
    theme: 'frontend',
    category: 'nextjs',
    thumbnail: '',
    language: 'ko'
  },
  {
    id: '2',
    title: 'Next.js의 App Router와 Pages Router 비교',
    topic: '라우팅',
    description: 'Next.js의 새로운 App Router와 기존 Pages Router의 차이점을 알아봅니다.\nNext.js 13에서 도입된 App Router는 더 강력한 기능과 간편한 사용성을 제공합니다.\n\n이 게시물에서는 두 라우팅 시스템의 구조적 차이와 장단점을 비교하고, 마이그레이션 전략을 제시합니다.',
    author: 'Vans',
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19',
    tags: ['Next.js', 'App Router', 'React'],
    viewCount: 95,
    likeCount: 10,
    theme: 'frontend',
    category: 'nextjs',
    thumbnail: '',
    language: 'ko'
  }
];

export default function NextjsListPage() {
  const { t } = useTranslation('post');
  const [posts, setPosts] = useState<NextjsPost[]>(MOCK_POSTS);
  const [sortOption, setSortOption] = useState('latest');
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 커스텀 훅을 사용하여 윈도우 너비와, 마진 적용 여부 관리
  const { windowWidth, shouldApplyMargin } = useSidebarMargin();

  // 정렬 유틸리티 함수를 사용하여 정렬
  const sortedPosts = sortPosts(posts, sortOption);
  const postsToShow = sortedPosts.slice(0, visiblePosts);

  return (
    <div className={`transition-all duration-300 ${shouldApplyMargin ? 'ml-0 lg:ml-64' : ''}`}>
      <div className="left-auto min-h-screen bg-black relative overflow-hidden">
        {/* 그리드 배경 */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(#80808015 1px, transparent 1px), radial-gradient(#80808015 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px'
          }}
        />
        
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
                <source src="/nextjs_background.webm" type="video/webm" />
              </video>
            </div>

            <div className="relative mb-8 pb-8 border-b border-[#333333]">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <SiNextdotjs className="w-8 h-8" />
                  <h1 className="text-2xl font-semibold text-white">Next.js</h1>
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
                      <SiNextdotjs className="w-7 h-7" />
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