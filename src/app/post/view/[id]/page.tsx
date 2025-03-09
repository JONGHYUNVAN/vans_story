import { ViewPostHeader } from '../common/ViewPostHeader';
import { ViewPostContent } from '../common/ViewPostContent';
import { API_URLS } from '@/api/constants/apiUrl';
import { Post } from '@/interfaces/post/types';

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
    <div className="max-w-screen-lg mx-auto">
      <ViewPostHeader />
      <ViewPostContent post={post} />
    </div>
  );
}
