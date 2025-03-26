import { PostEditForm } from './PostEditForm'

interface PageProps {
  params: any
}

export default async function EditPostPage({ params }: PageProps) {
  return (
    <div className="max-w-screen-lg mx-auto z-50">
      <PostEditForm postId={params.id} />
    </div>
  )
} 