'use client';

import { useEffect } from 'react';

interface ViewCountHandlerProps {
  postId: string;
}

export function ViewCountHandler({ postId }: ViewCountHandlerProps) {
  useEffect(() => {
    // 쿠키에서 viewed_posts 가져오기
    const getCookie = (name: string) => {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`))
        ?.split('=')[1];
    };

    const viewedPostsCookie = getCookie('viewed_posts');
    const viewedPostsArray = viewedPostsCookie ? viewedPostsCookie.split(',') : [];
    
    // 이미 본 포스트가 아니라면 추가
    if (!viewedPostsArray.includes(postId)) {
      viewedPostsArray.push(postId);
      const newViewedPosts = viewedPostsArray.join(',');
      
      // 쿠키에 저장 (24시간)
      document.cookie = `viewed_posts=${newViewedPosts}; path=/; max-age=86400`;
    }
  }, [postId]);

  return null;
} 