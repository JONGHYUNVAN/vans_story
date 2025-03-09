import { API_URLS } from '@/api/constants/apiUrl';
import { Viewer } from '@/app/post/viewer/Viewer';
import { Post } from '@/interfaces/post/types';
import { SiNestjs } from 'react-icons/si';

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


export default async function ViewNestjsPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className=" min-h-screen bg-black border border-[#333333] rounded-lg p-8 text-white">
          <h1 className="text-2xl font-bold">포스트를 찾을 수 없습니다</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 text-white">
      <div className=" min-h-screen container mx-auto max-w-5xl px-4">
        <div className="min-h-screen bg-black border border-[#333333] rounded-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <SiNestjs className="w-10 h-10 text-[#E0234E]" />
            <h1 className="text-3xl font-bold text-white">{post.title}</h1>
          </div>
          
          <div className="flex items-center justify-between text-sm mb-6">
            <div className="flex items-center gap-4">
              <span>작성자: {post.author}</span>
              <span>주제: {post.topic}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>조회수: {post.viewCount}</span>
              <span>좋아요: {post.likeCount}</span>
            </div>
          </div>

          <div className="border-t border-[#333333] pt-6">
            <Viewer content={post.content} />
          </div>

          <div className="mt-6 flex items-center gap-2">
            {post.tags && post.tags.length > 0 && post.tags.map((tag: string) => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-[#1a1a1a] text-gray-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 