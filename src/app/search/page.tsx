import { fetchSearchResults } from '@/lib/api/search';
import SearchResultList from '@/components/features/search/SearchResultList';
import { Suspense } from 'react';
import SearchHeader from '@/components/features/search/SearchHeader';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

/**
 * 검색 결과 페이지
 * - URL의 'q' 파라미터를 이용해 검색 API를 호출하고 결과를 표시합니다.
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  // 서버 사이드에서 데이터 페칭
  const searchPromise = fetchSearchResults(query);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <SearchHeader query={query} />
        <Suspense fallback={<SearchResultList.Skeleton />}>
          <SearchResultContent query={query} searchPromise={searchPromise} />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * 검색 결과를 실제로 렌더링하는 컴포넌트
 * - Suspense를 통해 비동기 데이터를 처리합니다.
 */
async function SearchResultContent({
  query,
  searchPromise,
}: {
  query: string;
  searchPromise: Promise<any>;
}) {
  try {
    const data = await searchPromise;
    return <SearchResultList results={data.results} total={data.total} />;
  } catch (error) {
    return (
      <div className="text-center py-10 bg-gray-800 rounded-lg">
        <p className="text-red-400">검색 결과를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-gray-400 mt-2">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }
}
