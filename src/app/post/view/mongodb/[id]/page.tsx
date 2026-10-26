import { Viewer } from '@/components/features/post/viewer/Viewer';
import MongodbLayout from '@/app/post/view/mongodb/_components/MongodbLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import { getPostWithViewCount } from '@/lib/posts/clientActions';
import { ViewCountHandler } from '@/app/post/view/_components/ViewCountHandler';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewMongodbPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostWithViewCount(id);

  if (!post) {
    return (
      <MongodbLayout title="게시글을 찾을 수 없습니다">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white">포스트를 찾을 수 없습니다</h1>
        </div>
      </MongodbLayout>
    );
  }

  return (
    <SidebarWrapper>
      <MongodbLayout title={post.title}>
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

          <div className="prose prose-invert max-w-none rounded-lg bg-[rgba(72,48,29,0.5)] p-6 text-[#f6d6c0] [&_*]:!text-white [&_a]:!text-blue-300 [&_code]:!text-green-300 [&_em]:!text-white [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_h5]:!text-white [&_h6]:!text-white [&_li]:!text-white [&_strong]:!text-white [&_td]:!text-white [&_th]:!bg-gray-700 [&_th]:!text-white">
            <Viewer content={post.content} />
          </div>

          <div className="flex items-center gap-2">
            {post.tags &&
              post.tags.length > 0 &&
              post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#1a1a1a] px-2 py-1 text-xs text-gray-300"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </MongodbLayout>
    </SidebarWrapper>
  );
}
