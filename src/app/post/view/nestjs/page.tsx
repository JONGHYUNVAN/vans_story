'use client';

import { useState, useEffect } from 'react';
import { SiNestjs } from 'react-icons/si';
import PostCard from '@/app/post/view/postcard/nestjs/PostCard';
import { useTranslation } from '@/utils/i18n';

interface NestjsPost {
  id: string;
  title: string;
  topic: string;
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  theme: string;
  category: string;
  thumbnail: string;
  language: string;
}

const MOCK_POSTS: NestjsPost[] = [
  {
    id: '1',
    title: 'Nest.js 시작하기',
    topic: 'Controllers & Providers',
    description: 'Nest.js의 기본 구조와 핵심 개념에 대해 알아봅니다.\nNest.js는 효율적이고 확장 가능한 Node.js 서버 애플리케이션을 구축하기 위한 프레임워크입니다.\n이 게시물에서는 Controllers, Providers, Modules, Dependency Injection 등 Nest.js의 핵심 개념을 실제 예제와 함께 소개하며 실전에서 활용할 수 있는 방법을 다룹니다.',
    author: 'Vans',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    tags: ['Nest.js', 'Node.js', 'TypeScript'],
    viewCount: 98,
    likeCount: 12,
    theme: 'backend',
    category: 'nestjs',
    thumbnail: '',
    language: 'ko'
  },
  {
    id: '2',
    title: 'Nest.js에서 데이터베이스 연동하기',
    topic: 'TypeORM & Repository Pattern',
    description: 'Nest.js에서 TypeORM을 사용하여 효율적으로 데이터베이스를 관리하는 방법을 설명합니다.\nTypeORM은 TypeScript와 JavaScript를 위한 ORM 라이브러리로, Nest.js와의 통합이 매우 좋습니다.\n\n이 게시물에서는 엔티티 설계, 관계 설정, 레포지토리 패턴 활용, 마이그레이션 관리 등 실무에서 필요한 데이터베이스 관리 기법을 살펴봅니다.',
    author: 'Vans',
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19',
    tags: ['Nest.js', 'TypeORM', 'Database'],
    viewCount: 76,
    likeCount: 8,
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
  const [windowWidth, setWindowWidth] = useState(0);
  const [shouldApplyMargin, setShouldApplyMargin] = useState(false);

  useEffect(() => {
    // 초기 창 너비 설정
    setWindowWidth(window.innerWidth);
    
    // 마진 적용 여부 결정
    const checkMargin = () => {
      const width = window.innerWidth;
      setShouldApplyMargin(width > 1280 && width < 1536);
    };
    
    // 초기 마진 체크
    checkMargin();
    
    // 리사이즈 이벤트 핸들러
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      checkMargin();
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    
    // 클린업 함수
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 정렬 옵션에 따라 포스트 정렬
  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortOption) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'views':
        return b.viewCount - a.viewCount;
      case 'likes':
        return b.likeCount - a.likeCount;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // 필요한 수만큼 포스트 표시
  const postsToShow = sortedPosts.slice(0, visiblePosts);

  return (
    <div className={`transition-all duration-300 ${shouldApplyMargin ? 'ml-0 lg:ml-64' : ''}`}>
      <div className="left-auto min-h-screen bg-gradient-to-br from-[#3d0415] via-[#2a0110] to-[#1a000a] relative overflow-hidden">
        {/* Nest.js 로고 패턴 */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16.933 16.933' width='100' height='100' fill='%23E0234E'%3E%3Cpath d='M9.97.934L2.159 5.516c-.232.136-.373.39-.373.663v9.165c0 .273.14.527.373.663l7.812 4.582c.232.136.515.136.747 0l7.812-4.582c.232-.136.373-.39.373-.663V6.179c0-.273-.14-.527-.373-.663L10.717.934a.766.766 0 00-.747 0zm-.56 2.495l5.087 2.974L12.25 7.71 9.41 6.003zm-1.235.314v4.89L5.334 7.71 8.175 6.03zM4.397 8.764l1.82 1.067-1.82 1.067zm3.778.157l2.841 1.667-2.841 1.667-2.841-1.667zm4.715.91l1.82 1.067-1.82 1.067zm-4.715 2.471v4.89l-2.841-1.667 2.841-1.707zm1.235.314l2.841 1.516-5.087 2.974V13.45z'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }} />
        
        {/* 움직이는 그라데이션 효과 */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[#E0234E15] via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '15s' }} />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[#E0234E10] via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
        </div>
        
        {/* 글로우 효과 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[#E0234E10] blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-[#E0234E08] blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
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
                  post={{
                    id: post.id,
                    title: post.title,
                    description: post.description,
                    createdAt: post.createdAt,
                    tags: post.tags,
                    viewCount: post.viewCount,
                    likeCount: post.likeCount,
                    topic: post.topic,
                    author: post.author
                  }}
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