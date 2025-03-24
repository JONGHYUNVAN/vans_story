'use client';

import { TbBinaryTree, TbGraph } from 'react-icons/tb';
import PostCard from '../common/postcard/algorithm/PostCard';
import { useTranslation } from '@/utils/i18n';
import { FrameworkPost } from '@/types/FrameworkPost';
import { sortPosts } from '@/utils/sortPosts';
import Link from 'next/link';

interface Post extends FrameworkPost {
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
      {sortedPosts.map(post => (
        <Link 
          key={post._id}
          href={`/post/view/algorithm/${post._id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard
            post={post}
            renderBadge={() => (
              <span className="flex items-center justify-center w-10 h-8 rounded-full bg-gray-200 text-gray-700">
                {post.topic === '그래프' ? (
                  <TbGraph className="w-5 h-5" />
                ) : (
                  <TbBinaryTree className="w-5 h-5" />
                )}
              </span>
            )}
          />
        </Link>
      ))}
    </div>
  );
} 