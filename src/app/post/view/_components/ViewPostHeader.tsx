'use client'

import { useRouter } from 'next/navigation'

interface ViewPostHeaderProps {
  postId: string
}

export function ViewPostHeader({ postId }: ViewPostHeaderProps) {
  const router = useRouter()

  return (
    <div className="border-b border-gray-100/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl text-white font-gamjaFlower">게시글 보기</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
              onClick={() => {
                router.push(`/post/edit/${postId}`)
              }}
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 