import { API_URLS } from '@/constants/apiUrl';
import NextjsLayout from '@/app/post/view/nextjs/_components/NextjsLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import NextjsList from '@/app/post/view/nextjs/_components/NextjsList';
import { getPostList } from '@/lib/posts/clientActions';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;

  // 해당 카테고리의 게시글 목록을 조회
  const posts = await getPostList('nextjs', category);

  return (
    <SidebarWrapper>
      <NextjsLayout title={`Next.js - ${category}`}>
        {posts.length > 0 ? (
          <NextjsList posts={posts} />
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center text-white">
              <h2 className="mb-4 text-2xl font-bold">게시글이 없습니다</h2>
              <p className="text-gray-400">'{category}' 카테고리에 등록된 게시글이 없습니다.</p>
            </div>
          </div>
        )}
      </NextjsLayout>
    </SidebarWrapper>
  );
}
