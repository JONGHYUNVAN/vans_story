'use client';

import { useEffect, useState } from 'react';
import { API_URLS } from '@/api/constants/apiUrl';
import { FrameworkPost } from '@/types/FrameworkPost';
import PostCard from '../common/postcard/jwt/PostCard';
import { useTranslation } from '@/utils/i18n';
import { MdSecurity } from 'react-icons/md';

interface Post extends FrameworkPost {}

interface JWTListProps {
  posts: Post[];
}

export default function JWTList({ posts }: JWTListProps) {
  const { t } = useTranslation('jwt');
  const [jwtPosts, setJwtPosts] = useState<Post[]>(posts);

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
        setJwtPosts(data.data || []);
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
      }
    };

    fetchPosts();
  }, []);

  const renderBadge = (category: string) => {
    switch (category) {
      case 'basic':
        return () => (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#1E4D2B]/20 text-[#1E4D2B]">
            {t('categories.basic.title')}
          </span>
        );
      case 'advanced':
        return () => (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#1E4D2B]/20 text-[#1E4D2B]">
            {t('categories.advanced.title')}
          </span>
        );
      case 'security':
        return () => (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#1E4D2B]/20 text-[#1E4D2B]">
            {t('categories.security.title')}
          </span>
        );
      default:
        return () => (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#1E4D2B]/20 text-[#1E4D2B]">
            {t('categories.default.title')}
          </span>
        );
    }
  };

  if (jwtPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#4A5D66]/20 backdrop-blur-sm mb-4">
          <MdSecurity className="h-8 w-8 text-[#B8C6CD]" />
        </div>
        <h3 className="text-lg font-medium text-[#B8C6CD]">게시글이 없습니다</h3>
        <p className="mt-2 text-sm text-[#8B9DA4]">
          첫 번째 게시글을 작성해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {jwtPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          renderBadge={renderBadge(post.category)}
        />
      ))}
    </div>
  );
} 