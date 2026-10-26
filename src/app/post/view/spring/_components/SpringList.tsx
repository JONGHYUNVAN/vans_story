'use client';

import { SiSpring } from 'react-icons/si';
import Link from 'next/link';
import PostCard from '@/components/features/post/postcard/spring/PostCard';
import type { PostInfo } from '@/types/post';
import { sortPosts } from '@/components/features/post/sort/sortPosts';

interface SpringListProps {
  posts: PostInfo[];
}

export default function SpringList({ posts }: SpringListProps) {
  const sortedPosts = sortPosts(posts, 'latest');

  return (
    <div className="grid grid-cols-1 gap-6">
      {sortedPosts.map((post) => (
        <Link
          key={post.id}
          href={`/post/view/spring/${post.id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard
            post={post}
            renderBadge={() => (
              <span className="flex h-8 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700">
                <SiSpring className="h-5 w-5" />
              </span>
            )}
          />
        </Link>
      ))}
    </div>
  );
}
