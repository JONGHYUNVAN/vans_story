import { Viewer } from '@/app/post/viewer/Viewer';
import AlgorithmLayout from '../AlgorithmLayout';
import { SidebarWrapper } from '../../common/SidebarWrapper';
import { getPostWithViewCount } from '../../common/usePostView';
import { ViewCountHandler } from '../../common/ViewCountHandler';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AlgorithmDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostWithViewCount(id);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <SidebarWrapper>
      <AlgorithmLayout title={post.title}>
        <ViewCountHandler postId={id} />
        {/* 본문 */}
        <div className="prose prose-gray max-w-none">
          <Viewer content={post.content} />
        </div>
      </AlgorithmLayout>
    </SidebarWrapper>
  );
} 