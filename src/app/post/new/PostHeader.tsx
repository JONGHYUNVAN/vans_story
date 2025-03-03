import Link from "next/link";
import { useTranslation } from '@/utils/i18n';

interface PostHeaderProps {
  postData?: {
    title: string;
    content: string;
    theme: string;
    topic: string;
    description: string;
    tags: string[];
    category: string;
    thumbnail: string;
    language: string;
  };
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onTempSave: () => void;
}

/**
 * 게시글 관련 페이지들의 공통 헤더 컴포넌트
 * @component
 */
export function PostHeader({ postData, onSubmit, onTempSave }: PostHeaderProps) {
  const { t } = useTranslation('');
  
  return (
    <div className="mt-20 border-b border-gray-100/10 bg-black/80 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl text-white font-gamjaFlower">{t('post.create.title')}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              onClick={onTempSave}
            >
              {t('post.create.tempSave')}
            </button>
            <button
              type="submit"
              form="post-form"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
            >
              {t('post.create.submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
