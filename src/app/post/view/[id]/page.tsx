import { ViewPostHeader } from '@/app/post/view/_components/ViewPostHeader';
import { ViewPostContent } from '@/app/post/view/_components/ViewPostContent';
import { API_URLS } from '@/constants/apiUrl';
import type { Post } from '@/types/post';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string): Promise<Post> {
  const response = await fetch(`${API_URLS.POST.GET}/${id}`);
  if (!response.ok) {
    throw new Error(`게시글 조회 실패, ${response.status}`);
  }
  return response.json();
}

export default async function ViewPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <div className="mx-auto max-w-screen-lg">
      <ViewPostHeader postId={id} />
      <ViewPostContent post={post} />
    </div>
  );
}
