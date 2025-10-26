'use client'

import { PostForm } from '@/components/post/PostForm'

interface PostEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostEditPage({ params }: PostEditPageProps) {
  const { id } = await params
  
  return (
    <PostForm 
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