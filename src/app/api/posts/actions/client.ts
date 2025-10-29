import type { PostEditData } from '@/types/post';
import { Post } from '@/interfaces/post/types';
import { ApiFetch } from '@/lib/apiFetch';

export async function updatePost(postId: string, postData: PostEditData) {
  const response = await ApiFetch.patchWithAuth(`/api/posts/${postId}`, postData);
  
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || response.status.toString());
  }

  return response.json();
}

export async function getPostForEdit(postId: string) {
  const response = await ApiFetch.getWithAuth(`/api/posts/${postId}/edit`);

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
}

export function saveTempPost(postId: string, postData: PostEditData) {
  if (postData.title || postData.content || postData.mainCategory || postData.topic || 
      postData.description || postData.tags.length > 0 || postData.subCategory || 
      postData.thumbnail || postData.language) {
    localStorage.setItem(`temp_post_${postId}`, JSON.stringify(postData));
    return true;
  }
  return false;
}

export function loadTempPost(postId: string): PostEditData | null {
  const saved = localStorage.getItem(`temp_post_${postId}`);
  return saved ? JSON.parse(saved) : null;
}

// SSR용 게시물 목록 조회 (직접 백엔드 API 호출)
export async function getPostList(mainCategory: string, subCategory?: string, page = 1, limit = 10) {
  try {
    const url = new URL(`${process.env.POST_API_URL || 'http://localhost:3001/api/v1'}/posts`);
    url.searchParams.append('mainCategory', mainCategory);
    if (subCategory) url.searchParams.append('subCategory', subCategory);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    const response = await ApiFetch.basicGet(url.toString(), {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    return (data.data || []).map((post: any) => ({
      ...post,
      id: post._id || post.id
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// SSR용 개별 게시물 조회 (조회수 포함, 직접 백엔드 API 호출)
export async function getPostWithViewCount(id: string, hasViewed = false): Promise<Post> {
  const response = await ApiFetch.basicGet(`${process.env.POST_API_URL || 'http://localhost:3001/api/v1'}/posts/${id}`, {
    headers: {
      'x-viewed': hasViewed ? 'true' : 'false'
    },
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error(`게시글 조회 실패, ${response.status}`);
  }
  return response.json();
} 