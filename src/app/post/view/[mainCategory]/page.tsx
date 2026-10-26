import { notFound } from 'next/navigation';
import { getPostTheme } from '@/constants/postThemes';
import { getPostList } from '@/lib/posts/clientActions';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import PostLayout from '@/components/features/post/view/PostLayout';
import PostList from '@/components/features/post/view/PostList';

interface PageProps {
  params: Promise<{ mainCategory: string }>;
}

/**
 * 빌드 시점에는 getPostList가 API를 부르지 않아(isBuildPhase) 정적 생성하면 빈 목록이 영구히 굳는다.
 * 요청 시 렌더링하고, 백엔드 호출은 fetch의 revalidate 60초 데이터 캐시로 완충한다.
 */
export const dynamic = 'force-dynamic';

/** 카테고리 글 목록 (/post/view/nextjs 등). 모르는 카테고리는 404. */
export default async function PostListPage({ params }: PageProps) {
  const { mainCategory } = await params;
  const theme = getPostTheme(mainCategory);
  if (!theme) notFound();

  const posts = await getPostList(theme.key, undefined, 1, 10);

  return (
    <SidebarWrapper>
      <PostLayout themeKey={theme.key} title={theme.name}>
        <PostList themeKey={theme.key} posts={posts} />
      </PostLayout>
    </SidebarWrapper>
  );
}
