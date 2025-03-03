export interface BasePost {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  topic?: string;
  author?: string;
  theme?: string;
  thumbnail?: string; // 썸네일 이미지 URL (옵션)
}
