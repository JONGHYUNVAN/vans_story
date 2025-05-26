'use client';

import { FrameworkPost } from '@/types/FrameworkPost';
import { TbDatabase } from 'react-icons/tb';
import { useTranslation } from '@/utils/i18n';

interface PostCardProps {
  post: FrameworkPost;
  renderBadge?: () => React.ReactNode;
}

export default function PostCard({ post, renderBadge }: PostCardProps) {
  const { t } = useTranslation('');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <TbDatabase className="w-5 h-5 text-gray-700" />
            <span className="text-sm text-gray-600">{post.topic}</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>{t('post.views', { count: post.viewCount })}</span>
              <span>{t('post.likes', { count: post.likeCount })}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{t('post.by', { author: post.author })}</span>
            </div>
          </div>
        </div>
        
        {renderBadge && (
          <div className="ml-4">
            {renderBadge()}
          </div>
        )}
      </div>
    </div>
  );
} 