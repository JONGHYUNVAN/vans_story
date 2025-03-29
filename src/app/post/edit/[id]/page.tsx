import { PostEditForm } from './PostEditForm'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const postId = await params.id;
  
  return (
    <div className="max-w-screen-lg mx-auto z-50">
      <PostEditForm postId={postId} />
    </div>
  )
} 