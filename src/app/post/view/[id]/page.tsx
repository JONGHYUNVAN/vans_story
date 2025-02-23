import { ViewPostHeader } from '../ViewPostHeader'
import { ViewPostContent } from '../ViewPostContent'
import { postAPI } from '@/api/post/postApi'

export default async function ViewPostPage({ params: { id } }: { params: { id: string } }) {
  const post = await postAPI.getPost(Number(id))

  return (
    <div className="max-w-screen-lg mx-auto">
      <ViewPostHeader />
      <ViewPostContent post={post} />
    </div>
  )
}