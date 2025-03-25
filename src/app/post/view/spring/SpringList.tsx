'use client';

import { SiSpring } from 'react-icons/si';
import PostCard from '../common/postcard/spring/PostCard';
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

export default function SpringList({ posts }: Props) {
  const { t } = useTranslation('post');
  const sortedPosts = sortPosts(posts, 'latest');

  return (
    <div className="grid grid-cols-1 gap-6">
      {sortedPosts.map(post => (
        <Link 
          key={post._id}
          href={`/post/view/spring/${post._id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard
            post={post}
            renderBadge={() => (
              <span className="flex items-center justify-center w-10 h-8 rounded-full bg-black/50 backdrop-blur-sm">
                <SiSpring className="w-7 h-7 text-[#6DB33F]" />
              </span>
            )}
          />
        </Link>
      ))}
    </div>
  );
} 