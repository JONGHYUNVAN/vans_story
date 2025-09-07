import { Suspense } from 'react';
import SearchHeader from '@/components/features/search/SearchHeader';
import SearchResultContent from '@/components/features/search/SearchResultContent';

type PageProps = {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

/**
 * 검색 결과 페이지
 * - URL의 'q' 파라미터를 이용해 검색 결과를 표시합니다.
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
