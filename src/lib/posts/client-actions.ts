import type { PostEditData } from '@/types/post';
import { Post } from '@/interfaces/post/types';
import { ApiFetch } from '@/lib/apiFetch';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

const isBuildPhase = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

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
  if (isBuildPhase) return [];

  try {
    const apiUrl = process.env.POST_API_URL || 'http://localhost:3001/api/v1';
    const url = new URL(`${apiUrl}/posts`);
    url.searchParams.append('mainCategory', mainCategory);
    if (subCategory) url.searchParams.append('subCategory', subCategory);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch posts:', response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const posts = (data.data || []).map((post: any) => ({
      ...post,
      id: post._id || post.id
    }));

    return posts;
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    return [];
  }
}

// SSR용 개별 게시물 조회 (조회수 포함, 직접 백엔드 API 호출)
export async function getPostWithViewCount(id: string, hasViewed = false): Promise<Post> {
  if (isBuildPhase) throw new Error('Build phase: skipping API call');

  const apiUrl = process.env.POST_API_URL || 'http://localhost:3001/api/v1';
  const fullUrl = `${apiUrl}/posts/${id}`;

  const response = await ApiFetch.basicGet(fullUrl, {
    headers: {
      'x-viewed': hasViewed ? 'true' : 'false'
    },
    cache: 'no-store'
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ 게시글 조회 실패:', response.status, response.statusText, errorText);
    throw new Error(`게시글 조회 실패, ${response.status}`);
  }
  
  return response.json();
}

