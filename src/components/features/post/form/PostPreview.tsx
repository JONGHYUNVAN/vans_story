/**
 * 통합 PostPreview 컴포넌트
 * 실제 카테고리 페이지와 같은 PostCard·PostLayout을 테마만 바꿔 그린다.
 */

import type { PostInfo, PostPreviewProps } from '@/types/post';
import { getPostTheme } from '@/constants/postThemes';
import { Viewer } from '@/components/features/post/viewer/Viewer';
import PostCard from '@/components/features/post/view/PostCard';
import PostLayout from '@/components/features/post/view/PostLayout';

// memo 제거: 실시간 미리보기에서는 즉시 반영이 더 중요
export function PostPreview({
  post,
  isViewerMounted = true,
  showCard = true,
  showLayout = true,
}: PostPreviewProps) {
  // post가 유효한 객체인지 확인
  if (!post || typeof post !== 'object') {
    return (
      <div className="mt-4 rounded border border-red-400 bg-red-100 p-4">
        <p className="text-red-800">유효하지 않은 포스트 데이터입니다.</p>
      </div>
    );
  }

  // 필수 데이터 검증
  if (!post.title || !post.content || !post.mainCategory) {
    return (
      <div className="mt-4 rounded border border-yellow-400 bg-yellow-100 p-4">
        <p className="text-yellow-800">미리보기를 표시하기 위한 데이터가 부족합니다.</p>
        <ul className="mt-2 text-sm text-yellow-700">
          {!post.title && <li>• 제목이 필요합니다</li>}
          {!post.content && <li>• 내용이 필요합니다</li>}
          {!post.mainCategory && <li>• 메인 카테고리가 필요합니다</li>}
        </ul>
      </div>
    );
  }

  // content는 원본 그대로 사용 (객체 또는 문자열)
  const postInfo: PostInfo = {
    id: post.id || 'preview',
    title: post.title,
    topic: post.topic || '',
    description: post.description || '',
    content: post.content,
    author: post.author || '미리보기',
    authorEmail: post.authorEmail || '',
    createdAt: post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || new Date().toISOString(),
    tags: post.tags || [],
    viewCount: post.viewCount || 0,
    likeCount: post.likeCount || 0,
    mainCategory: post.mainCategory,
    subCategory: post.subCategory || '',
    thumbnail: post.thumbnail || '',
    language: post.language || 'ko',
  };

  const theme = getPostTheme(post.mainCategory);

  if (!theme) {
    // 지원하지 않는 카테고리의 경우 기본 레이아웃
    return (
      <div className="mt-4 space-y-8">
        <div className="prose max-w-none text-white">
          <h1>{post.title}</h1>
          <div className="mb-4 text-sm text-gray-400">
            메인 카테고리: {post.mainCategory} | 하위 카테고리: {post.subCategory} | 주제:{' '}
            {post.topic}
          </div>
          {isViewerMounted && <Viewer content={post.content} />}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-8">
      {showCard && <PostCard themeKey={theme.key} post={postInfo} />}
      {showLayout && (
        <PostLayout themeKey={theme.key} title={post.title} isPreview>
          <div className={theme.detail.proseClass}>
            {isViewerMounted && <Viewer content={post.content} />}
          </div>
        </PostLayout>
      )}
    </div>
  );
}
