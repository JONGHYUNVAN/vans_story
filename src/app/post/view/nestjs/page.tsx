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
      <div className="left-auto min-h-screen relative">
        {/* 배경 비디오 */}
        <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50"
          >
            <source src="/nestjs_background.webm" type="video/webm" />
          </video>
        </div>
        <div className="relative">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#333333]">
              <div className="flex items-center gap-3">
                <SiNestjs className="w-8 h-8 text-[#E0234E]" />
                <h1 className="text-2xl font-semibold text-white">Nest.js</h1>
              </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-center w-36 py-2 bg-[#000000] text-white border border-[#333333] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#333333]"
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