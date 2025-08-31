import SearchResultList from '@/components/features/search/SearchResultList';
import { Suspense } from 'react';
import SearchHeader from '@/components/features/search/SearchHeader';
import { GET as searchApiGET } from '../api/search/route'; // API 라우트 핸들러 직접 임포트

type PageProps = {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

/**
 * 검색 결과 페이지
 * - URL의 'q' 파라미터를 이용해 검색 API를 호출하고 결과를 표시합니다.
 */
export default async function SearchPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const rawQuery = sp.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery ?? '';

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <SearchHeader query={query} />
        <Suspense fallback={<SearchResultListSkeleton />}>
          <SearchResultContent query={query} />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * 검색 결과를 실제로 렌더링하는 컴포넌트
 */
async function SearchResultContent({ query }: { query: string }) {
  if (!query) {
    return <SearchResultList results={[]} total={0} />;
  }

  try {
    // 가짜 Request 객체 생성
    const request = new Request(`http://localhost/api/search?query=${encodeURIComponent(query)}`);
    
    // API 핸들러를 직접 호출 (네트워크 요청 없음)
    const response = await searchApiGET(request);
    const data = await response.json();

    return <SearchResultList results={data.results || []} total={data.total || 0} />;
  } catch (error) {
    console.error('Search API call error:', error);
    return (
      <div className="text-center py-10 bg-gray-800 rounded-lg">
        <p className="text-red-400">검색 결과를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-gray-400 mt-2">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }
}

/** 스켈레톤 UI */
function SearchResultListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg bg-gray-800 p-4 h-20" />
      ))}
    </div>
  );
}
