'use client';

import { SiSpring } from 'react-icons/si';
import PostCard from '../../../../components/ui/post/postcard/spring/PostCard';
import { useTranslation } from '@/utils/i18n';
import { PostInfo } from "@/interfaces/post/types";
import { sortPosts } from '@/components/features/post/sort/sortPosts';
import Link from 'next/link';

interface SpringListProps {
  posts: PostInfo[];
}

export default function SpringList({ posts }: SpringListProps) {
  const { t } = useTranslation('post');
  const sortedPosts = sortPosts(posts, 'latest');

  return (
    <div className="grid grid-cols-1 gap-6">
      {sortedPosts.map(post => (
        <Link 
          key={post.id}
          href={`/post/view/spring/${post.id}`}
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