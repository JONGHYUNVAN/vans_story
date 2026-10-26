import { SearchResult } from '@/types/api/search';
import SearchResultItem from './SearchResultItem';

interface SearchResultListProps {
  results: SearchResult[];
  total: number;
}

/**
 * 검색 결과 목록을 표시하는 컴포넌트
 */
function SearchResultList({ results, total }: SearchResultListProps) {
  if (total === 0) {
    return (
      <div className="rounded-lg bg-gray-800 py-10 text-center">
        <p className="text-xl text-gray-300">검색 결과가 없습니다.</p>
        <p className="mt-2 text-gray-500">다른 키워드로 검색해보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-400">{`총 ${total}개의 검색 결과를 찾았습니다.`}</p>
      {results.map((item) => (
        <SearchResultItem key={item.post_id} item={item} />
      ))}
    </div>
  );
}

/**
 * 검색 결과 목록 로딩 스켈레톤 UI
 */
SearchResultList.Skeleton = function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-1/4 rounded bg-gray-700"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-lg border border-gray-700 bg-gray-800 p-6">
          <div className="mb-4 h-6 w-3/4 rounded bg-gray-700"></div>
          <div className="mb-2 h-4 w-full rounded bg-gray-700"></div>
          <div className="h-4 w-5/6 rounded bg-gray-700"></div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultList;
