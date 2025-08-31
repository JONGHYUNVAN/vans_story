'use client';

import { useState } from 'react';
import { SiNestjs } from 'react-icons/si';
import PostCard from '../../../../components/ui/post/postcard/nestjs/PostCard';
import { useTranslation } from '@/utils/i18n';
import { PostInfo } from "@/interfaces/post/types";
import { sortPosts } from '@/components/features/post/sort/sortPosts';
import Link from 'next/link';

interface NestjsListProps {
  posts: PostInfo[];
}

export default function NestjsList({ posts: initialPosts }: NestjsListProps) {
  const { t } = useTranslation('post');
  const [posts] = useState<PostInfo[]>(initialPosts);
  const [sortOption, setSortOption] = useState('latest');
  const [visiblePosts, setVisiblePosts] = useState(10);

  // 정렬 유틸리티 함수를 사용하여 정렬
  const sortedPosts = sortPosts(posts, sortOption);
  const postsToShow = sortedPosts.slice(0, visiblePosts);

  return (<>
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
      {postsToShow.map((post, index) => (
        <Link
          key={post.id}
          href={`/post/view/nestjs/${post.id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard
            post={post}
            renderBadge={() => (
              <span className="flex items-center justify-center w-10 h-8 rounded-full bg-gray-200 text-gray-700">
                <SiNestjs className="w-5 h-5" />
              </span>
            )}
          />
        </Link>
      ))}
    </div>
  </>);
} 