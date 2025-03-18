export interface Post {
    thumbnail: string;
    title: string;
    theme: string;
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