'use client'

import { PostHeader } from './PostHeader'
import { PostCreateForm } from './PostCreateForm'

export default function NewPostPage() {
  return (
    <div className="max-w-screen-lg mx-auto">
      <PostHeader />
      <PostCreateForm />
    </div>
  )
}
