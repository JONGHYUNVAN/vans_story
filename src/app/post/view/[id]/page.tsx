import { ViewPostHeader } from '../ViewPostHeader';
import { ViewPostContent } from '../ViewPostContent';
import { postAPI } from '@/api/post/postApi';

// PageProps 타입 정의
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await postAPI.getPost(Number(id));

  return (
    <div className="max-w-screen-lg mx-auto">
      <ViewPostHeader />
      <ViewPostContent post={post} />
    </div>
  );
}
