import { notFound } from 'next/navigation';
import { ViewPostHeader } from '@/app/post/view/_components/ViewPostHeader';
import { ViewPostContent } from '@/app/post/view/_components/ViewPostContent';
import { getPostWithViewCount } from '@/lib/posts/clientActions';
import type { Post } from '@/types/post';

interface PageProps {
  params: Promise<{ id: string }>;
}

function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * 카테고리 없는 공용 상세 페이지.
 * 서버 컴포넌트에서는 상대 경로 fetch('/api/posts/…')가 Invalid URL로 터지므로 백엔드를 직접 부르는 로더를 쓴다.
 * (D단계에서 카테고리 라우트와 통합 예정)
 */
export default async function ViewPostPage({ params }: PageProps) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  let post: Post;
  try {
    post = await getPostWithViewCount(id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-screen-lg">
      <ViewPostHeader postId={id} />
      <ViewPostContent post={post} />
    </div>
  );
}
