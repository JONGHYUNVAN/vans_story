'use client'

import { useTranslation } from '@/utils/i18n'
import type { PostData } from '../types/post'

type PostEditHeaderProps = {
  postId: string
  postData: PostData
}

export function PostEditHeader({ postId, postData }: PostEditHeaderProps) {
  const { t } = useTranslation('')

  const handleSubmit = () => {
    window.dispatchEvent(new CustomEvent('postSubmit', { detail: { postId } }))
  }

  const handleTempSave = () => {
    window.dispatchEvent(new CustomEvent('postTempSave', { detail: { postId } }))
  }

  return (
    <div className="flex justify-end items-center mb-6">
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