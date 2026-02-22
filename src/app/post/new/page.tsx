'use client'

import { PostFormWindows } from '@/components/post/PostFormWindows'
import { useRouter } from 'next/navigation'

export default function NewPostPage() {
  const router = useRouter()

  return (
    <PostFormWindows 
      mode="create"
      onSubmit={async (data) => {
        console.log('✅ 포스트 생성 완료:', data)
        // 필요시 추가 작업 수행 가능
      }}
      onTempSave={(data) => {
        console.log('💾 임시저장 완료:', data)
      }}
    />
  )
}
