import { Post } from '@/interfaces/post/types'
import { Viewer } from '../../viewer/Viewer'

export function ViewPostContent({ post }: { post: Post }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
        <div className="flex items-center gap-4">
          <span>작성자: {post.author}</span>
          <span>테마: {post.theme}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>작성일: {post.createdAt}</span>
          {post.updatedAt !== post.createdAt && (
            <span>수정일: {post.updatedAt}</span>
          )}
        </div>
      </div>
      <div className="prose prose-invert max-w-none">
        <Viewer content={post.content} />
      </div>
    </div>
  )
} 