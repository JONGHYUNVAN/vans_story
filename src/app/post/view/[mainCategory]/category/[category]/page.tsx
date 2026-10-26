import { notFound } from 'next/navigation';
import { getPostTheme } from '@/constants/postThemes';
import { getPostList } from '@/lib/posts/clientActions';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import PostLayout from '@/components/features/post/view/PostLayout';
import PostList from '@/components/features/post/view/PostList';

interface PageProps {
  params: Promise<{ mainCategory: string; category: string }>;
}

// 목록 페이지와 같은 이유로 요청 시 렌더링 (빌드 시점 API 호출 생략 → 빈 목록 고정 방지)
export const dynamic = 'force-dynamic';

/** 하위 카테고리별 글 목록 (/post/view/nextjs/category/introduction 등). */
export default async function PostCategoryPage({ params }: PageProps) {
  const { mainCategory, category } = await params;
  const theme = getPostTheme(mainCategory);
  if (!theme) notFound();

  const posts = await getPostList(theme.key, category);

  return (
    <SidebarWrapper>
      <PostLayout themeKey={theme.key} title={`${theme.name} - ${category}`}>
        {posts.length > 0 ? (
          <PostList themeKey={theme.key} posts={posts} />
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className={`text-center ${theme.emptyTextClass}`}>
              <h2 className="mb-4 text-2xl font-bold">게시글이 없습니다</h2>
              <p className="opacity-70">
                &apos;{category}&apos; 카테고리에 등록된 게시글이 없습니다.
              </p>
            </div>
          </div>
        )}
      </PostLayout>
    </SidebarWrapper>
  );
}
