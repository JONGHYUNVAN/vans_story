'use client';

import { useState } from 'react';
import { SiSpring } from 'react-icons/si';
import PostCard from '../common/postcard/spring/PostCard';
import { useTranslation } from '@/utils/i18n';
import { FrameworkPost } from '@/types/FrameworkPost';
import { sortPosts } from '@/utils/sortPosts';
import { useSidebarMargin } from '@/hooks/useSidebarMargin';

// SpringPost 타입을 FrameworkPost를 확장하는 타입으로 정의
type SpringPost = FrameworkPost;

const MOCK_POSTS: SpringPost[] = [
  {
    id: '1',
    title: 'Spring Framework 시작하기',
    topic: 'IoC & DI',
    description: 'Spring Framework의 핵심 개념과 기본 구조를 알아봅니다.\nSpring은 자바 엔터프라이즈 애플리케이션 개발을 위한 오픈소스 프레임워크입니다.\n이 게시물에서는 IoC, DI, AOP 등 Spring의 핵심 개념을 실제 예제와 함께 소개하며 실전에서 활용할 수 있는 방법을 다룹니다.',
    author: 'Vans',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    tags: ['Spring', 'Java', 'Backend'],
    viewCount: 120,
    likeCount: 15,
    theme: 'backend',
    category: 'spring',
    thumbnail: '',
    language: 'ko'
  },
  {
    id: '2',
    title: 'Spring Data JPA 활용하기',
    topic: 'JPA & Hibernate',
    description: 'Spring Data JPA를 사용하여 효율적으로 데이터베이스를 관리하는 방법을 설명합니다.\nJPA는 자바 진영의 ORM 표준 기술이며, Spring Data JPA는 이를 더욱 편리하게 사용할 수 있게 해줍니다.\n\n이 게시물에서는 엔티티 매핑, 연관관계 설정, 리포지토리 활용, 쿼리 메소드 작성 등 실무에서 필요한 데이터 접근 기술을 살펴봅니다.',
    author: 'Vans',
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19',
    tags: ['Spring', 'JPA', 'Database'],
    viewCount: 95,
    likeCount: 10,
    theme: 'backend',
    category: 'spring',
    thumbnail: '',
    language: 'ko'
  }
];

export default function SpringListPage() {
  const { t } = useTranslation('post');
  const [posts, setPosts] = useState<SpringPost[]>(MOCK_POSTS);
  const [sortOption, setSortOption] = useState('latest');
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 커스텀 훅을 사용하여 윈도우 너비와, 마진 적용 여부 관리
  const { windowWidth, shouldApplyMargin } = useSidebarMargin();

  // 정렬 유틸리티 함수를 사용하여 정렬
  const sortedPosts = sortPosts(posts, sortOption);
  const postsToShow = sortedPosts.slice(0, visiblePosts);

  return (
    <div className={`transition-all duration-300 ${shouldApplyMargin ? 'ml-0 lg:ml-64' : ''}`}>
      <div className="left-auto min-h-screen bg-[#0c1511] relative overflow-hidden">
        {/* 배경 레이어 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101b17] to-[#0a100d] z-0"></div>
        
        {/* Spring 로고 패턴 */}
        <div className="absolute inset-0 opacity-[0.03] z-[1]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M91.8 28.6C86.9 16.8 77.5 7.4 65.7 2.5 59.9 0.2 53.7-0.5 47.6 0.3 41.5 1.1 35.7 3.4 30.6 7 25.5 10.6 21.3 15.4 18.2 21 15.1 26.6 13.3 32.8 12.9 39.2 12.5 45.6 13.6 52 16.1 57.9 18.6 63.8 22.3 69.1 27 73.4 31.7 77.7 37.2 81 43.2 83.1 49.2 85.2 55.6 86 62 85.6 68.4 85.2 74.6 83.4 80.2 80.3 85.8 77.2 90.6 73 94.2 67.9 97.8 62.8 100.1 57 100.9 50.9 101.7 44.8 101 38.6 98.7 32.8 93.8 21 84.4 11.6 72.6 6.7L91.8 28.6Z' fill='%236DB33F'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* 움직이는 그라데이션 효과 */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[#6DB33F08] via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '15s' }} />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[#6DB33F05] via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
        </div>
        
        {/* 글로우 효과 */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[#6DB33F05] blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-[#6DB33F03] blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        </div>
        
        <div className="relative z-[2]">
          <div className="mx-auto max-w-5xl px-6 py-12 min-h-screen border-x border-slate-700/30 relative">
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
                <source src="/spring_background.webm" type="video/webm" />
              </video>
            </div>

            <div className="relative z-10 mb-8 pb-8 border-b border-slate-700/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SiSpring className="w-8 h-8 text-[#6DB33F]" />
                  <h1 className="text-2xl font-semibold text-white">Spring</h1>
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="text-center w-36 py-2 bg-black/50 backdrop-blur-sm text-white border border-slate-700/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6DB33F]/40"
                >
                  <option value="latest">{t('post.sort.latest')}</option>
                  <option value="oldest">{t('post.sort.oldest')}</option>
                  <option value="views">{t('post.sort.views')}</option>
                  <option value="likes">{t('post.sort.likes')}</option>
                </select>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-6">
              {postsToShow.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  renderBadge={(post: SpringPost) => (
                    <span className="flex items-center justify-center w-10 h-8 rounded-full bg-black/50 backdrop-blur-sm">
                      <SiSpring className="w-7 h-7 text-[#6DB33F]" />
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