import { PostEditForm } from './PostEditForm'

interface PageProps {
  params: Promise<any>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <div className="max-w-screen-lg mx-auto z-50">
      <PostEditForm postId={id} />
    </div>
  )
} 