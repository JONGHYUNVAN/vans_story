import type { PostInfo } from '@/types/post';
import { getPostTheme } from '@/constants/postThemes';
import { Viewer } from '@/components/features/post/viewer/Viewer';
import PostCard from '@/components/features/post/view/PostCard';
import PostLayout from '@/components/features/post/view/PostLayout';

interface PostPreviewProps {
  id: string;
  title: string;
  content: string;
  theme: string;
  topic: string;
  description: string;
  tags: string[];
  category: string;
  thumbnail: string;
  language: string;
  isViewerMounted?: boolean;
}

/** 에디터 옆 실시간 미리보기: 카드 + 카테고리 레이아웃 안의 본문 */
export function PostPreview({
  id,
  title,
  content,
  theme,
  topic,
  description,
  tags,
  category,
  thumbnail,
  language,
  isViewerMounted = true,
}: PostPreviewProps) {
  const postData: PostInfo = {
    id,
    title,
    description,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags,
    viewCount: 0,
    likeCount: 0,
    topic,
    author: '미리보기',
    authorEmail: '',
    mainCategory: theme,
    subCategory: category,
    thumbnail,
    language,
  };

  const postTheme = getPostTheme(theme);

  if (!postTheme) {
    return (
      <div className="mt-4 space-y-8">
        <div className="prose max-w-none text-white">
          <h1>{title}</h1>
          {isViewerMounted && <Viewer content={content} />}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-8">
      <PostCard themeKey={postTheme.key} post={postData} />
      <PostLayout themeKey={postTheme.key} title={title} isPreview>
        <div className={postTheme.detail.proseClass}>
          {isViewerMounted && <Viewer content={content} />}
        </div>
      </PostLayout>
    </div>
  );
}
