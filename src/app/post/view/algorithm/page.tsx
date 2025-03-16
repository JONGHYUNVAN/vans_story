'use client';

import { useState } from 'react';
import { TbBinaryTree, TbGraph } from 'react-icons/tb';
import { RiCodeBoxLine } from 'react-icons/ri';
import PostCard from '../common/postcard/algorithm/PostCard';
import { useTranslation } from '@/utils/i18n';
import { FrameworkPost } from '@/types/FrameworkPost';
import { sortPosts } from '@/utils/sortPosts';
import { useSidebarMargin } from '@/hooks/useSidebarMargin';

// AlgorithmPost 타입을 FrameworkPost를 확장하는 타입으로 정의
type AlgorithmPost = FrameworkPost;

const MOCK_POSTS: AlgorithmPost[] = [
  {
    id: '1',
    title: '알고리즘 기초',
    topic: '입문',
    description: '알고리즘의 기본 개념과 중요성에 대해 알아봅니다.\n알고리즘은 문제를 해결하기 위한 명확한 절차와 단계를 의미합니다.\n시간 복잡도와 공간 복잡도의 개념을 통해 알고리즘의 효율성을 측정하는 방법도 함께 살펴봅니다.',
    author: 'Vans',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    tags: ['기초', '복잡도', '알고리즘'],
    viewCount: 120,
    likeCount: 15,
    theme: 'algorithm',
    category: 'algorithm',
    thumbnail: '',
    language: 'ko'
  },
  {
    id: '2',
    title: '정렬 알고리즘의 이해',
    topic: '정렬',
    description: '다양한 정렬 알고리즘의 원리와 구현 방법을 알아봅니다.\n버블 정렬, 삽입 정렬, 선택 정렬부터 퀵 정렬, 병합 정렬, 힙 정렬까지 다양한 정렬 알고리즘의 특징과 성능을 비교해봅니다.\n\n각 알고리즘의 시간 복잡도와 공간 복잡도를 분석하고, 최적의 사용 시나리오에 대해 알아봅니다.',
    author: 'Vans',
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19',
    tags: ['정렬', '퀵정렬', '병합정렬'],
    viewCount: 95,
    likeCount: 10,
    theme: 'algorithm',
    category: 'algorithm',
    thumbnail: '',
    language: 'ko'
  },
  {
    id: '3',
    title: '그래프 탐색 알고리즘',
    topic: '그래프',
    description: '그래프 탐색의 기본 알고리즘인 DFS(깊이 우선 탐색)와 BFS(너비 우선 탐색)에 대해 알아봅니다.\n그래프 자료구조의 기본 개념부터 인접 행렬과 인접 리스트 표현 방법까지 함께 살펴봅니다.\n\n다양한 실전 문제를 통해 그래프 탐색 알고리즘의 활용법을 익혀봅시다.',
    author: 'Vans',
    createdAt: '2024-03-18',
    updatedAt: '2024-03-18',
    tags: ['그래프', 'DFS', 'BFS'],
    viewCount: 80,
    likeCount: 12,
    theme: 'algorithm',
    category: 'algorithm',
    thumbnail: '',
    language: 'ko'
  }
];

export default function AlgorithmListPage() {
  const { t } = useTranslation('post');
  const [posts, setPosts] = useState<AlgorithmPost[]>(MOCK_POSTS);
  const [sortOption, setSortOption] = useState('latest');
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 커스텀 훅을 사용하여 윈도우 너비와, 마진 적용 여부 관리
  const { windowWidth, shouldApplyMargin } = useSidebarMargin();

  // 정렬 유틸리티 함수를 사용하여 정렬
  const sortedPosts = sortPosts(posts, sortOption);
  const postsToShow = sortedPosts.slice(0, visiblePosts);

  return (
    <div className={`transition-all duration-300 ${shouldApplyMargin ? 'ml-0 lg:ml-64' : ''}`}>
      <div className="left-auto min-h-screen bg-white relative overflow-hidden">
        {/* 배경 레이어 */}
        <div className="absolute inset-0 bg-white z-0"></div>
        
        {/* 알고리즘 패턴 배경 */}
        <div className="absolute inset-0 opacity-[0.05] z-[1]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' stroke='%23777777' fill='none' stroke-width='1.5'/%3E%3Ccircle cx='30' cy='30' r='3' fill='%23777777'/%3E%3Ccircle cx='15' cy='15' r='2' fill='%23777777'/%3E%3Ccircle cx='45' cy='15' r='2' fill='%23777777'/%3E%3Ccircle cx='15' cy='45' r='2' fill='%23777777'/%3E%3Ccircle cx='45' cy='45' r='2' fill='%23777777'/%3E%3Cpath d='M15 15 L30 30 M45 15 L30 30 M15 45 L30 30 M45 45 L30 30' stroke='%23777777' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }} />
        </div>
        
        {/* 움직이는 그라데이션 효과 제거 */}
        
        {/* 알고리즘 연결 그래프 효과 */}
        <div className="absolute inset-0 z-[1] overflow-hidden opacity-5">
          <svg width="100%" height="100%" className="absolute top-0 left-0">
            <g stroke="#777777" fill="none" strokeWidth="0.5">
              <circle cx="10%" cy="20%" r="5" fill="#777777" />
              <circle cx="30%" cy="10%" r="5" fill="#777777" />
              <circle cx="50%" cy="15%" r="5" fill="#777777" />
              <circle cx="70%" cy="10%" r="5" fill="#777777" />
              <circle cx="90%" cy="20%" r="5" fill="#777777" />
              <circle cx="20%" cy="40%" r="5" fill="#777777" />
              <circle cx="40%" cy="50%" r="5" fill="#777777" />
              <circle cx="60%" cy="45%" r="5" fill="#777777" />
              <circle cx="80%" cy="40%" r="5" fill="#777777" />
              <circle cx="10%" cy="80%" r="5" fill="#777777" />
              <circle cx="30%" cy="70%" r="5" fill="#777777" />
              <circle cx="50%" cy="75%" r="5" fill="#777777" />
              <circle cx="70%" cy="85%" r="5" fill="#777777" />
              <circle cx="90%" cy="90%" r="5" fill="#777777" />
              
              <path d="M 10% 20% L 30% 10% L 50% 15% L 70% 10% L 90% 20%" />
              <path d="M 10% 20% L 20% 40% L 40% 50% L 60% 45% L 80% 40% L 90% 20%" />
              <path d="M 20% 40% L 10% 80% L 30% 70% L 50% 75% L 70% 85% L 90% 90%" />
              <path d="M 10% 80% L 30% 70% L 30% 10%" />
              <path d="M 50% 15% L 50% 75%" />
              <path d="M 70% 10% L 70% 85%" />
              <path d="M 30% 70% L 20% 40%" />
              <path d="M 50% 75% L 40% 50%" />
              <path d="M 70% 85% L 60% 45%" />
              <path d="M 90% 90% L 80% 40%" />
            </g>
          </svg>
        </div>
        
        <div className="relative z-[2]">
          <div className="mx-auto max-w-5xl px-6 py-12 min-h-screen border-x border-black relative">
          {/* 배경 비디오 */}
          <div className="absolute inset-0 z-[-1]">
              <div className="absolute inset-0 bg-white" />
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-5"
              >
                <source src="/algorithm_background.webm" type="video/webm" />
              </video>
            </div>
            <div className="relative mb-8 pb-8 border-b border-black">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <RiCodeBoxLine className="w-8 h-8 text-gray-700" />
                  <h1 className="text-2xl font-semibold text-gray-900">Algorithm</h1>
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="text-center w-36 py-2 bg-white shadow-sm text-gray-700 border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
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
                    <span className="flex items-center justify-center w-10 h-8 rounded-full bg-gray-200 text-gray-700">
                      {post.topic === '그래프' ? (
                        <TbGraph className="w-5 h-5" />
                      ) : (
                        <TbBinaryTree className="w-5 h-5" />
                      )}
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