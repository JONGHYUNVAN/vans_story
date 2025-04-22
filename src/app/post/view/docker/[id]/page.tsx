import { Viewer } from '@/app/post/viewer/Viewer';
import { Post } from '@/interfaces/post/types';
import DockerLayout from '../DockerLayout';
import { SidebarWrapper } from '../../common/SidebarWrapper';
import { getPostWithViewCount } from '../../api/getPostById';
import { ViewCountHandler } from '../../common/ViewCountHandler';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewDockerPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostWithViewCount(id);
  
  if (!post) {
    return (
      <DockerLayout title="게시글을 찾을 수 없습니다">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white">포스트를 찾을 수 없습니다</h1>
        </div>
      </DockerLayout>
    );
  }

  return (
    <SidebarWrapper>
      <DockerLayout title={post.title}>
        <ViewCountHandler postId={id} />
        <div className="space-y-6 text-white">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>작성자: {post.author}</span>
              <span>주제: {post.topic}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>조회수: {post.viewCount}</span>
              <span>좋아요: {post.likeCount}</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <Viewer content={post.content} />
          </div>

          <div className="flex items-center gap-2">
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
      </DockerLayout>
    </SidebarWrapper>
  );
} 