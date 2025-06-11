'use client'

import { useTranslation } from '@/utils/i18n'
import type { PostData } from '../types/post'

type PostEditHeaderProps = {
  postId: string
  postData: PostData
}

export function PostEditHeader({ postId, postData }: PostEditHeaderProps) {
  const { t } = useTranslation('post')

  const handleSubmit = () => {
    window.dispatchEvent(new CustomEvent('postSubmit', { detail: { postId } }))
  }

  const handleTempSave = () => {
    window.dispatchEvent(new CustomEvent('postTempSave', { detail: { postId } }))
  }

  return (
    <div className="flex justify-between items-center mb-6">
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
      <div className="flex items-center space-x-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('post.edit.submit')}
        </button>
        <button
          onClick={handleTempSave}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          {t('post.edit.tempSave')}
        </button>
      </div>
    </div>
  )
} 