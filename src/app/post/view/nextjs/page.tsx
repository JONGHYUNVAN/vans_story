'use client';

import { useState, useEffect } from 'react';
import { SiNextdotjs } from 'react-icons/si';
import PostCard from '@/app/post/view/postcard/nextjs/PostCard';
import { useTranslation } from '@/utils/i18n';

interface NextjsPost {
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

const MOCK_POSTS: NextjsPost[] = [
  {
    id: '1',
    title: 'Next.js 13 시작하기',
    topic: 'App Router',
    description: 'Next.js 13의 새로운 기능과 App Router에 대해 알아봅니다.\nNext.js 13은 기존의 Pages Router에서 App Router로의 전환을 통해 더 유연하고 직관적인 라우팅 구조를 제공합니다.\n이 게시물에서는 App Router의 동작 방식, 인터셉팅 라우트, 병렬 라우트, 레이아웃, 서버 컴포넌트와의 통합 등 주요 기능들을 실제 예제와 함께 소개하며 실전에서 활용할 수 있는 방법을 다룹니다.',
    author: 'Vans',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    tags: ['Next.js', 'React', 'App Router'],
    viewCount: 120,
    likeCount: 15,
    theme: 'frontend',
    category: 'nextjs',
    thumbnail: '',
    language: 'ko'
  },
  {
    id: '2',
    title: 'Next.js에서 서버 컴포넌트 활용하기',
    topic: 'React Server Components',
    description: 'React Server Components를 사용하여 성능을 최적화하는 방법을 설명합니다.\n서버 컴포넌트는 클라이언트에 JavaScript 번들을 전송하지 않고 서버에서 렌더링하여 네트워크 요청 및 클라이언트 부하를 줄여줍니다. 이를 통해 초기 로딩 성능이 향상되고 보안이 강화됩니다.\n\nNext.js에서 서버 컴포넌트와 클라이언트 컴포넌트를 적절히 조합하는 전략과 데이터 가져오기, 상태 관리, 캐싱 기법 등 실용적인 패턴을 소개합니다.',
    author: 'Vans',
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19',
    tags: ['Next.js', 'React', 'Server Components'],
    viewCount: 85,
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
      <div className="left-auto min-h-screen bg-[#0a0a0a] relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
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
                  <SiNextdotjs className="w-8 h-8 text-white" />
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
                    <span className="flex items-center justify-center w-10 h-8 rounded-full bg-black">
                      <SiNextdotjs className="w-7 h-7 text-white" />
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