import { API_URLS } from '@/api/constants/apiUrl';
import { Viewer } from '@/app/post/viewer/Viewer';
import { Post } from '@/interfaces/post/types';
import { RiCodeBoxLine } from 'react-icons/ri';

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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* 배경 레이어 */}
      <div className="absolute inset-0 bg-white z-0"></div>
      
      {/* 알고리즘 패턴 배경 */}
      <div className="absolute inset-0 opacity-[0.05] z-[1]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' stroke='%23777777' fill='none' stroke-width='1.5'/%3E%3Ccircle cx='30' cy='30' r='3' fill='%23777777'/%3E%3Ccircle cx='15' cy='15' r='2' fill='%23777777'/%3E%3Ccircle cx='45' cy='15' r='2' fill='%23777777'/%3E%3Ccircle cx='15' cy='45' r='2' fill='%23777777'/%3E%3Ccircle cx='45' cy='45' r='2' fill='%23777777'/%3E%3Cpath d='M15 15 L30 30 M45 15 L30 30 M15 45 L30 30 M45 45 L30 30' stroke='%23777777' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }} />
      </div>
      <div className="relative z-[2]">
        <div className="mx-auto max-w-5xl px-6 py-12 min-h-screen border-x border-black relative">
          {/* 배경 */}
          <div className="absolute inset-0 z-[-1]">
            <div className="absolute inset-0 bg-white" />
          </div>

          {/* 헤더 */}
          <div className="relative mb-8 pb-8 border-b border-black">
            <div className="flex items-center gap-3">
              <RiCodeBoxLine className="w-8 h-8 text-gray-700" />
              <h1 className="text-2xl font-semibold text-gray-900">{post.title}</h1>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>작성자: {post.authorEmail?.split('@')[0] || '-'}</span>
                <span>주제: {post.topic || '-'}</span>
                <span>조회수: {post.viewCount ?? 0}</span>
                <span>좋아요: {post.likeCount ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                {post.tags && post.tags.length > 0 && post.tags.map((tag: string) => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs border border-black/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className="prose prose-gray max-w-none">
            <Viewer content={post.content} />
          </div>
        </div>
      </div>
    </div>
  );
} 