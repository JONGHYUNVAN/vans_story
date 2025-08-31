'use client';

import { useEffect, useState } from 'react';
import { SiJsonwebtokens } from 'react-icons/si';
import { API_URLS } from '@/constants/apiUrl';
import { PostInfo } from "@/interfaces/post/types";
import PostCard from '../../../../components/ui/post/postcard/jwt/PostCard';
import { useTranslation } from '@/utils/i18n';
import { sortPosts } from '@/components/features/post/sort/sortPosts';
import Link from 'next/link';

interface JWTListProps {
  posts: PostInfo[];
}

export default function JWTList({ posts }: JWTListProps) {
  const { t } = useTranslation('post');
  const [jwtPosts, setJwtPosts] = useState<PostInfo[]>(sortPosts(posts, 'latest'));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URLS.POST.LIST}?theme=jwt&page=1&limit=10`, {
          next: { revalidate: 0 }
        });
        
        if (!response.ok) {
          throw new Error('게시글을 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        const mappedData = (data.data || []).map((post: any) => ({
          ...post,
          id: post._id || post.id
        }));
        setJwtPosts(sortPosts(mappedData, 'latest'));
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    (<div className="grid grid-cols-1 gap-6">
      {jwtPosts.map((post) => (
        <Link
          key={post.id}
          href={`/post/view/jwt/${post.id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard
            post={post}
            renderBadge={() => (
              <span className="flex items-center justify-center w-10 h-8 rounded-full bg-gray-200 text-gray-700">
                <SiJsonwebtokens className="w-5 h-5" />
              </span>
            )}
          />
        </Link>
      ))}
    </div>)
  );
} 