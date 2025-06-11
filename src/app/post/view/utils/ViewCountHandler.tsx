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

    // 쿠키 삭제
    const deleteCookie = (name: string) => {
      document.cookie = `${name}=; path=/; max-age=0`;
    };

    // 세션 체크
    const sessionValue = sessionStorage.getItem('viewed_posts');
    const cookieValue = getCookie('viewed_posts');

    // 세션이 없는데 쿠키가 있다면 쿠키 삭제
    if (!sessionValue && cookieValue) {
      deleteCookie('viewed_posts');
    }

    // 현재 조회한 포스트 목록 가져오기 (세션 또는 쿠키에서)
    const viewedPostsArray = (sessionValue || cookieValue || '').split(',').filter(Boolean);
    
    // 이미 본 포스트가 아니라면 추가
    if (!viewedPostsArray.includes(postId)) {
      viewedPostsArray.push(postId);
      const newViewedPosts = viewedPostsArray.join(',');
      
      // 세션 스토리지에 저장
      sessionStorage.setItem('viewed_posts', newViewedPosts);
      
      // 쿠키에 저장 (24시간)
      document.cookie = `viewed_posts=${newViewedPosts}; path=/; max-age=86400`;
    }
  }, [postId]);

  return null;
} 