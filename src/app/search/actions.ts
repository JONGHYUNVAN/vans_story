'use server';

import { redirect } from 'next/navigation';

/**
 * 검색 폼 제출을 처리하는 서버 액션입니다.
 * FormData에서 검색어를 추출하여 /search 경로로 리디렉션합니다.
 * @param formData 폼 데이터
 */
export async function handleSearch(formData: FormData) {
  const query = formData.get('q') as string;

  if (query?.trim()) {
    redirect(`/search?q=${encodeURIComponent(query.trim())}`);
  } else {
    redirect('/');
  }
}
