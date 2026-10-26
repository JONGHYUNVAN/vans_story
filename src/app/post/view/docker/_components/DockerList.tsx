'use client';

import { FaDocker } from 'react-icons/fa';
import Link from 'next/link';
import PostCard from '@/components/features/post/postcard/docker/PostCard';
import type { PostInfo } from '@/types/post';
import { sortPosts } from '@/components/features/post/sort/sortPosts';

interface DockerListProps {
  posts: PostInfo[];
}

export default function DockerList({ posts }: DockerListProps) {
  const sortedPosts = sortPosts(posts, 'latest');

  return (
    <div className="grid grid-cols-1 gap-6">
      {sortedPosts.map((post) => (
        <Link
          key={post.id}
          href={`/post/view/docker/${post.id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard
            post={post}
            renderBadge={() => (
              <span className="flex h-8 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700">
                <FaDocker className="h-5 w-5" />
              </span>
            )}
          />
        </Link>
      ))}
    </div>
  );
}
