'use client';

import { TbBinaryTree, TbGraph } from 'react-icons/tb';
import { RiCodeBoxLine } from 'react-icons/ri';
import PostCard from '../common/postcard/algorithm/PostCard';
import { useTranslation } from '@/utils/i18n';
import { FrameworkPost } from '@/types/FrameworkPost';
import { sortPosts } from '@/utils/sortPosts';
import Link from 'next/link';

interface Post extends FrameworkPost {
  _id: string;
}

export default function AlgorithmList({ posts }: { posts: Post[] }) {
  const { t } = useTranslation('post');
  const sortedPosts = sortPosts(posts, 'latest');

  return (
    <div className="transition-all duration-300 ml-0 lg:ml-64">
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
              
              <path d="M10%,20% L30%,10% L50%,15% L70%,10% L90%,20%" />
              <path d="M10%,20% L20%,40% L40%,50% L60%,45% L80%,40% L90%,20%" />
              <path d="M20%,40% L10%,80% L30%,70% L50%,75% L70%,85% L90%,90%" />
              <path d="M10%,80% L30%,70% L30%,10%" />
              <path d="M50%,15% L50%,75%" />
              <path d="M70%,10% L70%,85%" />
              <path d="M30%,70% L20%,40%" />
              <path d="M50%,75% L40%,50%" />
              <path d="M70%,85% L60%,45%" />
              <path d="M90%,90% L80%,40%" />
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
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {sortedPosts.map(post => (
                <Link 
                  key={post._id}
                  href={`/post/view/algorithm/${post._id}`}
                  className="block transition-transform hover:-translate-y-1"
                >
                  <PostCard
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
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 