'use client';

import { SiMongodb } from 'react-icons/si';
import Link from 'next/link';
import PostCard from '@/components/features/post/postcard/mongodb/PostCard';
import type { PostInfo } from '@/types/post';
import { sortPosts } from '@/components/features/post/sort/sortPosts';

interface Post extends PostInfo {
  _id: string;
}
interface MongodbListProps {
  posts: Post[];
}

export default function MongodbList({ posts }: MongodbListProps) {
  const sortedPosts = sortPosts(posts, 'latest');

  return (
    <div className="grid grid-cols-1 gap-6">
      {sortedPosts.map((post) => (
        <Link
          key={post.id}
          href={`/post/view/mongodb/${post.id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard
            post={post}
            renderBadge={() => (
              <span className="flex h-8 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700">
                <SiMongodb className="h-5 w-5" />
              </span>
            )}
          />
        </Link>
      ))}
    </div>
  );
}
