import SpringList from '@/app/post/view/spring/_components/SpringList';
import SpringLayout from '@/app/post/view/spring/_components/SpringLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import { getPostList } from '@/lib/posts/clientActions';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;

  // 해당 카테고리의 게시글 목록을 조회
  const posts = await getPostList('spring', category);

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <SidebarWrapper>
      <SpringLayout title={`Spring - ${categoryTitle}`}>
        {posts.length > 0 ? (
          <SpringList posts={posts} />
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center text-white">
              <h2 className="mb-4 text-2xl font-bold">게시글이 없습니다</h2>
              <p className="text-gray-400">
                &apos;{category}&apos; 카테고리에 등록된 게시글이 없습니다.
              </p>
            </div>
          </div>
        )}
      </SpringLayout>
    </SidebarWrapper>
  );
}
