'use client';

import { useState } from 'react';
import { SiMariadb } from 'react-icons/si';
import PostCard from '../common/postcard/mariadb/PostCard';
import { useTranslation } from '@/utils/i18n';
import { FrameworkPost } from '@/types/FrameworkPost';
import { sortPosts } from '@/utils/sortPosts';
import { useSidebarMargin } from '@/hooks/useSidebarMargin';

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
    <div className={`transition-all duration-300 ${shouldApplyMargin ? 'ml-0 lg:ml-64' : ''}`}>
      <div className="left-auto min-h-screen bg-[#0c1511] relative overflow-hidden">
        {/* 배경 레이어 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A2024] to-[#212A2E] z-0"></div>
        
        {/* MariaDB ER 다이어그램 패턴 */}
        <div className="absolute inset-0 opacity-[0.15] z-[1]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2300A1CB' stroke-width='1.5'%3E%3Ccircle cx='15' cy='15' r='6' /%3E%3Ccircle cx='65' cy='15' r='6' /%3E%3Ccircle cx='15' cy='65' r='6' /%3E%3Ccircle cx='65' cy='65' r='6' /%3E%3Cpath d='M22 15 L58 15' stroke-dasharray='3,3' /%3E%3Cpath d='M15 22 L15 58' stroke-dasharray='3,3' /%3E%3Cpath d='M22 65 L58 65' stroke-dasharray='3,3' /%3E%3Cpath d='M65 22 L65 58' stroke-dasharray='3,3' /%3E%3Crect x='35' y='35' width='10' height='10' stroke='%2300A1CB' fill='%2300A1CB' fill-opacity='0.2' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }} />
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
                <source src="/mariadb_background.webm" type="video/webm" />
              </video>
            </div>

            <div className="relative mb-8 pb-8 border-b border-blue-700/30">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <SiMariadb className="w-8 h-8 text-[#003545]" />
                  <h1 className="text-2xl font-semibold text-white">MariaDB</h1>
                </div>
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
          </div>
        </div>
      </div>
    </div>
  );
} 