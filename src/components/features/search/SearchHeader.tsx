import { FaSearch } from 'react-icons/fa';
import { handleSearch } from '@/app/search/actions';

interface SearchHeaderProps {
  query: string;
}

/**
 * 검색 결과 페이지의 헤더 컴포넌트 (서버 액션 사용)
 * - 검색창과 검색어 정보를 표시합니다.
 */
export default function SearchHeader({ query }: SearchHeaderProps) {
  return (
    <header className="mb-8">
      <form action={handleSearch} className="relative flex items-center mb-4">
        <input
          type="text"
          name="q"
          defaultValue={query} // defaultValue를 사용하여 서버에서 전달된 초기값 설정
          placeholder="다시 검색..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg text-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-3"
          required
        />
        <button
          type="submit"
          className="absolute right-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors focus:outline-none"
          aria-label="검색 실행"
        >
          <FaSearch />
        </button>
      </form>
      {query && (
        <h1 className="text-2xl font-bold">
          <span className="text-gray-400">'</span>
          <span className="text-blue-400">{query}</span>
          <span className="text-gray-400">'</span>
          <span className="text-gray-300">에 대한 검색 결과</span>
        </h1>
      )}
    </header>
  );
}
