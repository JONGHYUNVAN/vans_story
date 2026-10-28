import { cache } from 'react';
import type { Metadata } from 'next';
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

/** generateMetadata와 페이지가 같은 요청에서 한 번만 조회하도록 묶는다(조회수 이중 증가 방지). */
const getPost = cache((id: string) => getPostWithViewCount(id));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mainCategory, id } = await params;
  if (!getPostTheme(mainCategory) || !isValidObjectId(id)) return {};

  try {
    const post = await getPost(id);
    return {
      title: `${post.title} | Vans Dev Blog`,
      description: post.description || undefined,
      keywords: post.tags,
      alternates: { canonical: `/post/view/${mainCategory}/${id}` },
      openGraph: {
        type: 'article',
        title: post.title,
        description: post.description || undefined,
        url: `/post/view/${mainCategory}/${id}`,
        ...(post.thumbnail && { images: [post.thumbnail] }),
      },
    };
  } catch {
    return {};
  }
}

/** 포스트 상세. 카테고리·ObjectId 형식·조회 실패 모두 404로 통일한다(예전엔 카테고리마다 달랐다). */
export default async function PostDetailPage({ params }: PageProps) {
  const { mainCategory, id } = await params;
  const theme = getPostTheme(mainCategory);
  if (!theme || !isValidObjectId(id)) notFound();

  let post: Post;
  try {
    post = await getPost(id);
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
