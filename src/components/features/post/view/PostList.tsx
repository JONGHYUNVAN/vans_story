'use client';

import { useState } from 'react';
import Link from 'next/link';
import { POST_THEMES, type PostThemeKey } from '@/constants/postThemes';
import type { PostInfo } from '@/types/post';
import { useTranslation } from '@/lib/i18n';
import { sortPosts } from '@/components/features/post/sort/sortPosts';
import PostCard from './PostCard';

interface PostListProps {
  themeKey: PostThemeKey;
  posts: PostInfo[];
}

const PAGE_SIZE = 10;

/**
 * 카테고리 글 목록: 정렬 select + 카드 10개. 예전에는 카테고리에 따라 정렬이 있거나 없었다.
 */
export default function PostList({ themeKey, posts }: PostListProps) {
  const theme = POST_THEMES[themeKey];
  const { t } = useTranslation('post');
  const [sortOption, setSortOption] = useState('latest');
  const BadgeIcon = theme.badgeIcon;

  const postsToShow = sortPosts(posts, sortOption).slice(0, PAGE_SIZE);

  return (
    <>
      <div className="mb-8 flex justify-end">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={theme.selectClass}
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
            href={`${theme.path}/${post.id}`}
            className="block transition-transform hover:-translate-y-1"
          >
            <PostCard
              themeKey={themeKey}
              post={post}
              renderBadge={() => (
                <span
                  className={`flex h-8 w-10 items-center justify-center rounded-full ${theme.badgeClass}`}
                >
                  <BadgeIcon className="h-5 w-5" />
                </span>
              )}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
