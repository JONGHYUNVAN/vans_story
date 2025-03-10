import { FrameworkPost } from '../types/FrameworkPost';

/**
 * 포스트 목록을 지정된 정렬 옵션에 따라 정렬합니다
 * @param posts 정렬할 포스트 배열
 * @param sortOption 정렬 옵션 ('latest', 'oldest', 'views', 'likes')
 * @returns 정렬된 포스트 배열
 */
export function sortPosts<T extends FrameworkPost>(posts: T[], sortOption: string): T[] {
  return [...posts].sort((a, b) => {
    switch (sortOption) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'views':
        return b.viewCount - a.viewCount;
      case 'likes':
        return b.likeCount - a.likeCount;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
} 