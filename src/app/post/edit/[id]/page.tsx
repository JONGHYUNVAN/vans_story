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
        console.log('✅ 포스트 수정 완료:', data)
      }}
      onTempSave={(data) => {
        console.log('💾 임시저장 완료:', data)
      }}
      onSuccess={async (data) => {
        console.log('🎉 수정 성공:', data)
        // 성공 시 추가 작업 가능 (예: 토스트 알림)
      }}
      onError={(error) => {
        console.error('❌ 수정 실패:', error)
        // 에러 처리 (예: 에러 모달 표시)
      }}
    />
  )
}
