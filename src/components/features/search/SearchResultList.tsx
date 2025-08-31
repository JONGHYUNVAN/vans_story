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
      <div className="text-center py-10 bg-gray-800 rounded-lg">
        <p className="text-xl text-gray-300">검색 결과가 없습니다.</p>
        <p className="text-gray-500 mt-2">다른 키워드로 검색해보세요.</p>
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
    <div className="space-y-6 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultList;
