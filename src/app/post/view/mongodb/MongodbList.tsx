'use client';

import { SiMongodb } from 'react-icons/si';
import PostCard from '../common/postcard/mongodb/PostCard';
import { useTranslation } from '@/utils/i18n';
import { FrameworkPost } from '@/types/FrameworkPost';
import { sortPosts } from '@/utils/sortPosts';
import Link from 'next/link';

interface Post extends FrameworkPost {
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
          key={post._id}
          href={`/post/view/mongodb/${post._id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard
            post={post}
            renderBadge={() => (
              <span className="flex items-center justify-center w-10 h-8 rounded-full bg-black/50 backdrop-blur-sm">
                <SiMongodb className="w-7 h-7 text-[#B17B4F]" />
              </span>
            )}
          />
        </Link>
      ))}
    </div>
  );
} 