'use client'

import { PostCreateForm } from './PostCreateForm'
import { PostHeader } from './PostHeader'
/**
 * 게시글 작성 페이지
 * @page
 */
export default function CreatePostPage() {
  const handleSubmit = async (data: { title: string; content: string }) => {
    // API 호출 로직
    console.log(data)
  }

  return (
      <div className="mt-20 max-w-4xl mx-auto p-4">
        <PostHeader />
        <PostCreateForm/>
      </div>
  )
}
