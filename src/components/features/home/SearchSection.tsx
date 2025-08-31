import { FaSearch } from 'react-icons/fa';
import { handleSearch } from '@/app/search/actions';

/**
 * 홈페이지 검색 섹션 컴포넌트 (서버 액션 사용)
 * - 사용자가 검색어를 입력하고 검색을 실행할 수 있는 UI를 제공합니다.
 * - 폼 제출 시 서버 액션을 통해 /search 경로로 이동시킵니다.
 */
export default function SearchSection() {
  return (
    <section className="relative bg-gray-900 w-full py-16">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <form
            action={handleSearch}
            className="relative flex items-center bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2"
          >
            <input
              type="text"
              name="q" // 서버 액션이 FormData에서 읽을 수 있도록 name 속성 추가
              placeholder="궁금한 기술이나 키워드를 검색해보세요..."
              className="w-full bg-transparent text-lg text-gray-200 placeholder-gray-500 focus:outline-none px-4 py-2"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2"
              aria-label="검색 실행"
            >
              <FaSearch />
              <span>검색</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
