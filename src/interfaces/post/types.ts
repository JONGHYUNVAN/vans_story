export interface Post {
    thumbnail: string;
    title: string;
    mainCategory: string;
    subCategory: string;
    topic: string;
    content: string;
    author: string;
    authorEmail: string;
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    likeCount: number;
    tags: string[];
}
/**
 * 프레임워크 포스트 공통 인터페이스
 * Next.js, Nest.js, Spring 등 모든 프레임워크 포스트에서 사용
 */
export interface PostInfo {
  id: string;
  title: string;
  topic: string;
  description: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  mainCategory: string;
  subCategory: string;
  thumbnail: string;
  language: string;
}
