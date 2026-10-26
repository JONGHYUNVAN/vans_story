import { notFound } from 'next/navigation';
import { getPostTheme } from '@/constants/postThemes';
import { getPostWithViewCount } from '@/lib/posts/clientActions';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import { ViewCountHandler } from '@/app/post/view/_components/ViewCountHandler';
import PostLayout from '@/components/features/post/view/PostLayout';
import PostDetail from '@/components/features/post/view/PostDetail';
import type { Post } from '@/types/post';

interface PageProps {
  params: Promise<{ mainCategory: string; id: string }>;
}

function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/** 포스트 상세. 카테고리·ObjectId 형식·조회 실패 모두 404로 통일한다(예전엔 카테고리마다 달랐다). */
export default async function PostDetailPage({ params }: PageProps) {
  const { mainCategory, id } = await params;
  const theme = getPostTheme(mainCategory);
  if (!theme || !isValidObjectId(id)) notFound();

  let post: Post;
  try {
    post = await getPostWithViewCount(id);
  } catch {
    notFound();
  }

  return (
    <SidebarWrapper>
      <PostLayout themeKey={theme.key} title={post.title}>
        <ViewCountHandler postId={id} />
        <PostDetail themeKey={theme.key} post={post} />
      </PostLayout>
    </SidebarWrapper>
  );
}
