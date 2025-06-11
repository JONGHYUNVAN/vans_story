import { cookies } from 'next/headers';
import { API_URLS } from '@/constants/apiUrl';
import { Post } from '@/interfaces/post/types';

export async function getPostWithViewCount(id: string): Promise<Post> {
  const cookieStore = await cookies();
  const viewedPosts = cookieStore.get('viewed_posts');
  
  // 쿠키가 없으면 false로 처리
  const hasViewed = viewedPosts?.value?.split(',').includes(id) || false;

  // 쿠키가 업데이트되기 전이라도 SSR에서 조회 가능하도록 함
  const response = await fetch(`${API_URLS.POST.GET}/${id}`, {
    headers: {
      'x-viewed': hasViewed ? 'true' : 'false'
    },
    // 캐시 방지 
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error(`게시글 조회 실패, ${response.status}`);
  }
  return response.json();
} 