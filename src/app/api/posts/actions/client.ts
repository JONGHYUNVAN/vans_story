import { tokenStorage } from '@/utils/token';
import type { PostData } from '@/app/post/edit/[id]/types/post';

export async function updatePost(postId: string, postData: PostData) {
  const token = tokenStorage.getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || res.status.toString());
  }

  return res.json();
}

export async function getPost(postId: string) {
  const token = tokenStorage.getToken();
  const res = await fetch(`/api/posts/${postId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (!res.ok) {
    throw new Error(res.status.toString());
  }

  return res.json();
}

export function saveTempPost(postId: string, postData: PostData) {
  if (postData.title || postData.content || postData.theme || postData.topic || 
      postData.description || postData.tags.length > 0 || postData.category || 
      postData.thumbnail || postData.language) {
    localStorage.setItem(`temp_post_${postId}`, JSON.stringify(postData));
    return true;
  }
  return false;
}

export function loadTempPost(postId: string): PostData | null {
  const saved = localStorage.getItem(`temp_post_${postId}`);
  return saved ? JSON.parse(saved) : null;
} 