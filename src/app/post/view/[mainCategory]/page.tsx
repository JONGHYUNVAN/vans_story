import { notFound } from 'next/navigation';
import { POST_THEME_KEYS, getPostTheme } from '@/constants/postThemes';
import { getPostList } from '@/lib/posts/clientActions';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import PostLayout from '@/components/features/post/view/PostLayout';
import PostList from '@/components/features/post/view/PostList';

interface PageProps {
  params: Promise<{ mainCategory: string }>;
}

export function generateStaticParams() {
  return POST_THEME_KEYS.map((mainCategory) => ({ mainCategory }));
}

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
