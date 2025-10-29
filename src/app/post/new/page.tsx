'use client'

import { PostFormWindows } from '@/components/post/PostFormWindows'

export default function NewPostPage() {
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
