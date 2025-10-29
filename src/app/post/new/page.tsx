'use client'

import { PostForm } from '@/components/post/PostForm'
import { PostFormWindows } from '@/components/post/PostFormWindows'
import { useWindowSystem } from '@/hooks/useWindowSystem'

export default function NewPostPage() {
  const { shouldUseWindowSystem, isMounted } = useWindowSystem({
    minWidth: 1024,
    waitForMount: true,
  })

  // 마운트 전에는 로딩 표시
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // 데스크톱: Windows 11 스타일
  if (shouldUseWindowSystem) {
    return (
      <PostFormWindows 
        mode="create"
        onSubmit={async (data) => {
          console.log('포스트 생성 완료:', data)
        }}
        onTempSave={(data) => {
          console.log('임시저장 완료:', data)
        }}
      />
    )
  }

  // 모바일/태블릿: 기존 레이아웃
  return (
    <PostForm 
      mode="create"
      onSubmit={async (data) => {
        console.log('포스트 생성 완료:', data)
      }}
      onTempSave={(data) => {
        console.log('임시저장 완료:', data)
      }}
    />
  )
}
