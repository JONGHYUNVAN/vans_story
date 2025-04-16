import Link from 'next/link';
import { MdSecurity } from 'react-icons/md';
import { FrameworkPost } from '@/types/FrameworkPost';
import { useTranslation } from '@/utils/i18n';

interface PostCardProps {
  post: FrameworkPost;
  renderBadge?: () => React.ReactNode;
}

export default function PostCard({ post, renderBadge }: PostCardProps) {
  const { t } = useTranslation('jwt');

  return (
    <Link
      href={`/post/view/jwt/${post.id}`}
      className="block group"
    >
      <div className="relative overflow-hidden rounded-lg bg-[#1A1A1A] border border-[#FF3333]/20 transition-all duration-300 hover:border-[#1E4D2B]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            {renderBadge ? (
              renderBadge()
            ) : (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#1E4D2B]/20 text-[#1E4D2B]">
                {t('categories.default.title')}
              </span>
            )}
            <div className="flex items-center space-x-2 text-[#718096]">
              <MdSecurity className="w-4 h-4 text-[#1E4D2B]" />
              <span className="text-xs">{post.viewCount} views</span>
            </div>
          </div>
          
          <h3 className="mb-2 text-lg font-medium text-[#A0AEC0] group-hover:text-[#1E4D2B] transition-colors">
            {post.title}
          </h3>
          
          <p className="mb-4 text-sm text-[#718096] line-clamp-2">
            {post.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-[#718096]">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>{post.likeCount} likes</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 