'use client'

import { useTranslation } from '@/utils/i18n'
import { ViewMode, PostCreateViewModeProps } from '../types/post'

export function PostCreateViewMode({ viewMode, setViewMode }: PostCreateViewModeProps) {
  const { t } = useTranslation('')

  return (
    <div className="mt-2 border dark:border-[#333333] rounded flex">
      <button
        type="button"
        className={`py-2 px-4 ${viewMode === 'edit' ? 'bg-gray-200 dark:bg-[#333333]' : ''}`}
        onClick={() => setViewMode('edit')}
      >
        {t('post.create.edit')}
      </button>
      <button
        type="button"
        className={`py-2 px-4 ${viewMode === 'preview' ? 'bg-gray-200 dark:bg-[#333333]' : ''}`}
        onClick={() => setViewMode('preview')}
      >
        {t('post.create.preview')}
      </button>
    </div>
  )
} 