/**
 * 미리보기 전용 윈도우
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { PostPreview } from '@/components/post/PostPreview'
import { BasePost } from '@/types/post'

interface PreviewWindowContentProps {
  post: Partial<BasePost>
  showCard?: boolean
  showLayout?: boolean
}

export function PreviewWindowContent({
  post,
  showCard = true,
  showLayout = true
}: PreviewWindowContentProps) {
  const [isViewerMounted, setIsViewerMounted] = useState(false)

  useEffect(() => {
    setIsViewerMounted(true)
  }, [])

  return (
    <div className="h-full overflow-auto bg-gray-50/80">
      <div className="p-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                실시간 미리보기
              </h2>
              <p className="text-xs text-gray-600">
                작성 중인 내용이 실시간으로 표시됩니다
              </p>
            </div>
            {!post.title && !post.content && (
              <span className="text-xs text-gray-500 bg-gray-200/50 px-3 py-1.5 rounded-full">
                내용을 입력해주세요
              </span>
            )}
          </div>
        </div>
        
        <PostPreview
          post={post}
          isViewerMounted={isViewerMounted}
          showCard={showCard}
          showLayout={showLayout}
        />
      </div>
    </div>
  )
}

// 기본 아이콘
export const PreviewWindowIcon = <Eye size={14} />

