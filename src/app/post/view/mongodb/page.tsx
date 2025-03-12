'use client';

import { useState } from 'react';
import { SiMongodb } from 'react-icons/si';
import PostCard from '../common/postcard/mongodb/PostCard';
import { useTranslation } from '@/utils/i18n';
import { FrameworkPost } from '@/types/FrameworkPost';
import { sortPosts } from '@/utils/sortPosts';
import { useSidebarMargin } from '@/hooks/useSidebarMargin';

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
  
  // 커스텀 훅을 사용하여 윈도우 너비와, 마진 적용 여부 관리
  const { windowWidth, shouldApplyMargin } = useSidebarMargin();

  // 정렬 유틸리티 함수를 사용하여 정렬
  const sortedPosts = sortPosts(posts, sortOption);
  const postsToShow = sortedPosts.slice(0, visiblePosts);

  return (
    <div className={`transition-all duration-300 ${shouldApplyMargin ? 'ml-0 lg:ml-64' : ''}`}>
      <div className="left-auto min-h-screen bg-[#2c1d12] relative overflow-hidden">
        {/* 배경 레이어 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ba8448] to-[#8b5e2f] z-0"></div>
        
        {/* MongoDB 로고 패턴 */}
        <div className="absolute inset-0 opacity-[0.15] z-[1]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M15.9.087l.854 1.604c.192.296.4.558.645.802.715.715 1.394 1.464 2.004 2.266 1.447 1.9 2.423 4.01 3.12 6.292.418 1.394.645 2.824.662 4.27.07 4.323-1.412 8.035-4.4 11.12-.488.488-1.01.94-1.57 1.342-.296 0-.436-.227-.558-.436-.227-.383-.366-.802-.436-1.222-.174-.978-.314-1.974-.314-2.968 0-.314.07-.628.027-.94-.09-.706-.44-1.318-.98-1.82-.82-.766-1.9-.98-2.934-.57-.52.2-1.02.436-1.494.7-.315.174-.54.383-.834.366-.37-.006-.62-.296-.796-.575-.81-1.322-1.02-2.7-1.004-4.142.012-.94.314-1.796.664-2.645.836-2.022 2.08-3.784 3.743-5.18C12.46 6.782 13.67 6.15 15.065 6.15c.313 0 .627.727.94.122z' fill='%23f0d8a8'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
                
        <div className="relative z-[2]">
          <div className="mx-auto max-w-5xl px-6 py-12 min-h-screen border-x border-[#A67C52]/30 relative">
          {/* 배경 비디오 */}
          <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/70" />
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-30"
              >
                <source src="/mongodb_background.webm" type="video/webm" />
              </video>
            </div>
            <div className="relative mb-8 pb-8 border-b border-[#A67C52]/30">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <SiMongodb className="w-8 h-8 text-[#C19A6B]" />
                  <h1 className="text-2xl font-semibold text-white">MongoDB</h1>
                </div>
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
          </div>
        </div>
      </div>
    </div>
  );
} 