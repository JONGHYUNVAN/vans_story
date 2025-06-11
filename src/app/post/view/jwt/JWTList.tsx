'use client';

import { useEffect, useState } from 'react';
import { API_URLS } from '@/constants/apiUrl';
import { PostInfo } from "@/interfaces/post/types";
import PostCard from '../components/postcard/jwt/PostCard';
import { useTranslation } from '@/utils/i18n';
import { sortPosts } from '@/utils/sortPosts';
import Link from 'next/link';

interface Post extends PostInfo {
  _id: string;
}

interface JWTListProps {
  posts: Post[];
}

export default function JWTList({ posts }: JWTListProps) {
  const { t } = useTranslation('post');
  const [jwtPosts, setJwtPosts] = useState<Post[]>(sortPosts(posts, 'latest'));

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
        setJwtPosts(sortPosts(data.data || [], 'latest'));
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6">
      {jwtPosts.map((post) => (
        <Link
          key={post._id}
          href={`/post/view/jwt/${post._id}`}
          className="block transition-transform hover:-translate-y-1"
        >
          <PostCard post={post} />
        </Link>
      ))}
    </div>
  );
} 