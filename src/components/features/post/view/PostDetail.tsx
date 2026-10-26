import { POST_THEMES, type PostThemeKey } from '@/constants/postThemes';
import type { Post } from '@/types/post';
import { Viewer } from '@/components/features/post/viewer/Viewer';

interface PostDetailProps {
  themeKey: PostThemeKey;
  post: Post;
}

/**
 * 포스트 상세 본문: 메타(작성자·주제·조회수·좋아요) + 본문 + 태그. 밝은 테마는 본문만 보여준다.
 */
export default function PostDetail({ themeKey, post }: PostDetailProps) {
  const { detail } = POST_THEMES[themeKey];

  return (
    <div className={`space-y-6 ${detail.textClass}`}>
      {detail.showMeta && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span>작성자: {post.author}</span>
            <span>주제: {post.topic}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>조회수: {post.viewCount}</span>
            <span>좋아요: {post.likeCount}</span>
          </div>
        </div>
      )}

      <div className={detail.proseClass}>
        <Viewer content={post.content} />
      </div>

      {detail.showMeta && post.tags?.length > 0 && (
        <div className="flex items-center gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className={`rounded-full px-2 py-1 text-xs ${detail.tagClass}`}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
