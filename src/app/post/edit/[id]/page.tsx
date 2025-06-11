import { PostEditForm } from './components/PostEditForm'

interface PostEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostEditPage({ params }: PostEditPageProps) {
  const { id } = await params
  return <PostEditForm postId={id} />
} 