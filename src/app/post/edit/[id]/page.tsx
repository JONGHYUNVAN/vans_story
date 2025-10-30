'use client'

import { use } from 'react'
import { PostFormWindows } from '@/components/post/PostFormWindows'

interface PostEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PostEditPage({ params }: PostEditPageProps) {
  // Next.js 15에서 클라이언트 컴포넌트는 async가 될 수 없으므로
  // use() hook을 사용하여 Promise를 unwrap합니다
  const { id } = use(params)
  
  return (
    <PostFormWindows 
      mode="edit"
      initialData={{ id }}
      onSubmit={async (data) => {
        // 제출 로직은 usePost 훅에서 처리됨
        console.log('포스트 수정 완료:', data)
      }}
      onTempSave={(data) => {
        console.log('임시저장 완료:', data)
      }}
    />
  )
} 