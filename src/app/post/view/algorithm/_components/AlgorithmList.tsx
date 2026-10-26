'use client';

import { TbBinaryTree, TbGraph } from 'react-icons/tb';
import PostCard from '@/components/features/post/postcard/algorithm/PostCard';
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

export default function AlgorithmList({ posts }: Props) {
  const { t } = useTranslation('post');
  const sortedPosts = sortPosts(posts, 'latest');

  return (
    <div className="grid grid-cols-1 gap-6">
      {sortedPosts.map((post) => (
        <Link
          key={post.id}
          href={`/post/view/algorithm/${post.id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard
            post={post}
            renderBadge={() => (
              <span className="flex h-8 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700">
                {post.topic === '그래프' ? (
                  <TbGraph className="h-5 w-5" />
                ) : (
                  <TbBinaryTree className="h-5 w-5" />
                )}
              </span>
            )}
          />
        </Link>
      ))}
    </div>
  );
}
