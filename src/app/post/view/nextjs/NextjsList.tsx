'use client';

import { SiNextdotjs } from 'react-icons/si';
import PostCard from '../components/postcard/nextjs/PostCard';
import { useTranslation } from '@/utils/i18n';
import { PostInfo } from "@/interfaces/post/types";
import { sortPosts } from '@/utils/sortPosts';
import { useState } from 'react';
import Link from 'next/link';

interface Post extends PostInfo {
  _id: string;
}

interface Props {
  posts: Post[];
}

export default function NextjsList({ posts }: Props) {
  const { t } = useTranslation('post');
  const [sortOption, setSortOption] = useState('latest');
  const [visiblePosts, setVisiblePosts] = useState(10);

  // 정렬 유틸리티 함수를 사용하여 정렬
  const sortedPosts = sortPosts(posts, sortOption);
  const postsToShow = sortedPosts.slice(0, visiblePosts);

  return (
    <>
      <div className="flex justify-end mb-8">
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

      <div className="grid grid-cols-1 gap-6">
        {postsToShow.map(post => (
          <Link 
            key={post._id}
            href={`/post/view/nextjs/${post._id}`}
            className="block transition-transform hover:-translate-y-1"
          >
            <PostCard
              post={post}
              renderBadge={() => (
                <span className="flex items-center justify-center w-10 h-8 rounded-full bg-black/50">
                  <SiNextdotjs className="w-7 h-7" />
                </span>
              )}
            />
          </Link>
        ))}
      </div>
    </>
  );
} 