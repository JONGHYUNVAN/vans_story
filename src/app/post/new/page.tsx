'use client'

import { PostForm } from '@/components/post/PostForm'

export default function NewPostPage() {
  return (
    <PostForm 
      mode="create"
      onSubmit={async (data) => {
        // 제출 로직은 usePost 훅에서 처리됨
        console.log('포스트 생성 완료:', data)
      }}
      onTempSave={(data) => {
        console.log('임시저장 완료:', data)
      }}
    />
  )
}
