'use client';

import { FaDocker } from 'react-icons/fa';
import PostCard from '@/components/features/post/postcard/docker/PostCard';
import { useTranslation } from '@/lib/i18n';
import { PostInfo } from "@/types/post";
import { sortPosts } from '@/components/features/post/sort/sortPosts';
import Link from 'next/link';

interface DockerListProps {
  posts: PostInfo[];
}

export default function DockerList({ posts }: DockerListProps) {
  const { t } = useTranslation('post');
  const sortedPosts = sortPosts(posts, 'latest');

  return (
    <div className="grid grid-cols-1 gap-6">
      {sortedPosts.map(post => (
        <Link
          key={post.id}
          href={`/post/view/docker/${post.id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard
            post={post}
            renderBadge={() => (
              <span className="flex items-center justify-center w-10 h-8 rounded-full bg-gray-200 text-gray-700">
                <FaDocker className="w-5 h-5" />
              </span>
            )}
          />
        </Link>
      ))}
    </div>
  );
} 