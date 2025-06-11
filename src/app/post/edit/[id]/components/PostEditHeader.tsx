'use client'

import { useTranslation } from '@/utils/i18n'

interface PostEditHeaderProps {
  postId: string
  postData: {
    title: string
    content: string
    theme: string
    topic: string
    description: string
    tags: string[]
    category: string
    thumbnail: string
    language: string
  }
  onSubmit: () => Promise<void>
  onTempSave: () => void
}

export function PostEditHeader({ postId, postData, onSubmit, onTempSave }: PostEditHeaderProps) {
  const { t } = useTranslation('')

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{postData.title || t('post.create.titlePlaceholder')}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{postData.theme}</span>
          <span>•</span>
          <span>{postData.topic}</span>
          {postData.category && (
            <>
              <span>•</span>
              <span>{postData.category}</span>
            </>
          )}
          {postData.language && (
            <>
              <span>•</span>
              <span>{postData.language}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onTempSave} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
          {t('post.create.tempSave')}
        </button>
        <button onClick={onSubmit} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
          {t('post.create.submit')}
        </button>
      </div>
    </div>
  )
} 