'use client';

import { useState } from 'react';
import { SiNestjs } from 'react-icons/si';
import Link from 'next/link';
import PostCard from '@/components/features/post/postcard/nestjs/PostCard';
import { useTranslation } from '@/lib/i18n';
import type { PostInfo } from '@/types/post';
import { sortPosts } from '@/components/features/post/sort/sortPosts';

interface NestjsListProps {
  posts: PostInfo[];
}

export default function NestjsList({ posts: initialPosts }: NestjsListProps) {
  const { t } = useTranslation('post');
  const [posts] = useState<PostInfo[]>(initialPosts);
  const [sortOption, setSortOption] = useState('latest');
  const [visiblePosts] = useState(10);

  // 정렬 유틸리티 함수를 사용하여 정렬
  const sortedPosts = sortPosts(posts, sortOption);
  const postsToShow = sortedPosts.slice(0, visiblePosts);

  return (
    <>
      <div className="mb-8 flex justify-end">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-36 rounded-lg border border-[#333333] bg-black/50 py-2 text-center text-white backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-[#333333]"
        >
          <option value="latest">{t('post.sort.latest')}</option>
          <option value="oldest">{t('post.sort.oldest')}</option>
          <option value="views">{t('post.sort.views')}</option>
          <option value="likes">{t('post.sort.likes')}</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {postsToShow.map((post) => (
          <Link
            key={post.id}
            href={`/post/view/nestjs/${post.id}`}
            className="block transition-transform hover:-translate-y-1"
          >
            <PostCard
              post={post}
              renderBadge={() => (
                <span className="flex h-8 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700">
                  <SiNestjs className="h-5 w-5" />
                </span>
              )}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
