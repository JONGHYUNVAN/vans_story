'use client';

import { SiMongodb } from 'react-icons/si';
import PostCard from '../../../../components/ui/post/postcard/mongodb/PostCard';
import { useTranslation } from '@/utils/i18n';
import { PostInfo } from "@/interfaces/post/types";
import { sortPosts } from '@/components/features/post/sort/sortPosts';
import Link from 'next/link';

interface Post extends PostInfo {
  _id: string;
}
interface MongodbListProps {
  posts: Post[];
}

export default function MongodbList({ posts }: MongodbListProps) {
  const { t } = useTranslation('post');
  const sortedPosts = sortPosts(posts, 'latest');

  return (
    <div className="grid grid-cols-1 gap-6">
      {sortedPosts.map(post => (
        <Link
          key={post.id}
          href={`/post/view/mongodb/${post.id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard
            post={post}
            renderBadge={() => (
              <span className="flex items-center justify-center w-10 h-8 rounded-full bg-gray-200 text-gray-700">
                <SiMongodb className="w-5 h-5" />
              </span>
            )}
          />
        </Link>
      ))}
    </div>
  );
} 