import { Viewer } from '@/components/features/post/viewer/Viewer';
import { Post } from '@/interfaces/post/types';
import MariadbLayout from '../MariadbLayout';
import { SidebarWrapper } from '../../components/SidebarWrapper';
import { getPostWithViewCount } from '@/lib/posts/client-actions';
import { ViewCountHandler } from '../../components/ViewCountHandler';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewMariadbPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostWithViewCount(id);
  
  if (!post) {
    return (
      <MariadbLayout title="게시글을 찾을 수 없습니다">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white">포스트를 찾을 수 없습니다</h1>
        </div>
      </MariadbLayout>
    );
  }

  return (
    <SidebarWrapper>
      <MariadbLayout title={post.title}>
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

          <div className="prose prose-invert max-w-none [&_*]:!text-white [&_a]:!text-blue-300 [&_code]:!text-green-300 [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_h5]:!text-white [&_h6]:!text-white [&_strong]:!text-white [&_em]:!text-white [&_li]:!text-white [&_td]:!text-white [&_th]:!text-white [&_th]:!bg-gray-700">
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
      </MariadbLayout>
    </SidebarWrapper>
  );
} 