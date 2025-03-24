import { API_URLS } from '@/api/constants/apiUrl';
import { Viewer } from '@/app/post/viewer/Viewer';
import { Post } from '@/interfaces/post/types';
import AlgorithmLayout from '../AlgorithmLayout';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string): Promise<Post> {
  const response = await fetch(`${API_URLS.POST.GET}/${id}`);
  if (!response.ok) {
    throw new Error(`게시글 조회 실패, ${response.status}`);
  }
  const data = await response.json();
  console.log('전체 서버 응답 데이터:', data);
  return {
    ...data,
    topic: data.topic || data.theme || '-',
    viewCount: data.viewCount ?? 0,
    likeCount: data.likeCount ?? 0
  };
}

export default async function AlgorithmDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <AlgorithmLayout title={post.title}>
      {/* 본문 */}
      <div className="prose prose-gray max-w-none">
        <Viewer content={post.content} />
      </div>
    </AlgorithmLayout>
  );
} 