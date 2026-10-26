'use client';

import { TbDatabase } from 'react-icons/tb';
import type { PostInfo } from '@/types/post';
import { useTranslation } from '@/lib/i18n';

interface PostCardProps {
  post: PostInfo;
  renderBadge?: () => React.ReactNode;
}

export default function PostCard({ post, renderBadge }: PostCardProps) {
  const { t } = useTranslation('');

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <TbDatabase className="h-5 w-5 text-gray-700" />
            <span className="text-sm text-gray-600">{post.topic}</span>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">{post.title}</h2>
          <p className="mb-4 line-clamp-2 text-gray-600">{post.description}</p>

          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-700"
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

        {renderBadge && <div className="ml-4">{renderBadge()}</div>}
      </div>
    </div>
  );
}
