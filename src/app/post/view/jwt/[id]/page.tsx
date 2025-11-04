import { Viewer } from '@/components/features/post/viewer/Viewer';
import { SidebarWrapper } from '../../components/SidebarWrapper';
import { getPostWithViewCount } from '@/lib/posts/client-actions';
import { ViewCountHandler } from '../../components/ViewCountHandler';
import JWTLayout from '../JWTLayout';
import { showNotFound } from '@/utils/errorHandling';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewJwtPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostWithViewCount(id);
  
  if (!post) {
    showNotFound();
  }

  return (
    <SidebarWrapper>
      <JWTLayout title={post.title}>
        <ViewCountHandler postId={id} />
        <div className="space-y-6 text-[#A0AEC0]">
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

          <div className="prose max-w-none bg-[#0A0A0A] p-6 rounded-lg border border-[#FF3333]/20 prose-headings:text-[#A0AEC0] prose-p:text-[#A0AEC0] prose-strong:text-[#A0AEC0] prose-code:text-[#A0AEC0] prose-ul:text-[#A0AEC0] prose-ol:text-[#A0AEC0] prose-blockquote:text-[#A0AEC0] prose-a:text-[#1E4D2B] [&_*]:!text-[#A0AEC0] [&_a]:!text-blue-300 [&_code]:!text-green-300 [&_h1]:!text-[#A0AEC0] [&_h2]:!text-[#A0AEC0] [&_h3]:!text-[#A0AEC0] [&_h4]:!text-[#A0AEC0] [&_h5]:!text-[#A0AEC0] [&_h6]:!text-[#A0AEC0] [&_strong]:!text-[#A0AEC0] [&_em]:!text-[#A0AEC0] [&_li]:!text-[#A0AEC0] [&_td]:!text-[#A0AEC0] [&_th]:!text-[#A0AEC0] [&_th]:!bg-gray-700">
            <Viewer content={post.content} />
          </div>

          <div className="flex items-center gap-2">
            {post.tags && post.tags.length > 0 && post.tags.map((tag: string) => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-[#0A0A0A] text-[#A0AEC0] rounded-full text-xs border border-[#FF3333]/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </JWTLayout>
    </SidebarWrapper>
  );
} 