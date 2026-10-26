'use client';

import { FaDatabase } from 'react-icons/fa';
import { TbSql } from 'react-icons/tb';
import PostCard from '@/components/features/post/postcard/database-theory/PostCard';
import { useTranslation } from '@/lib/i18n';
import { PostInfo } from '@/types/post';
import { sortPosts } from '@/components/features/post/sort/sortPosts';
import Link from 'next/link';

interface Post extends PostInfo {
  _id: string;
}

interface Props {
  posts: Post[];
}

export default function DatabaseTheoryList({ posts }: Props) {
  const { t } = useTranslation('post');
  const sortedPosts = sortPosts(posts, 'latest');

  return (
    <div className="grid grid-cols-1 gap-6">
      {sortedPosts.map((post) => (
        <Link
          key={post.id}
          href={`/post/view/database-theory/${post.id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard
            post={post}
            renderBadge={() => (
              <span className="flex h-8 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700">
                {post.topic === 'SQL' ? (
                  <FaDatabase className="h-5 w-5" />
                ) : (
                  <TbSql className="h-5 w-5" />
                )}
              </span>
            )}
          />
        </Link>
      ))}
    </div>
  );
}
