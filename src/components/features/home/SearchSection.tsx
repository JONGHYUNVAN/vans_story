import { FaSearch } from 'react-icons/fa';
import { handleSearch } from '@/app/search/actions';

/**
 * 홈페이지 검색 섹션 컴포넌트 (서버 액션 사용)
 * - 사용자가 검색어를 입력하고 검색을 실행할 수 있는 UI를 제공합니다.
 * - 폼 제출 시 서버 액션을 통해 /search 경로로 이동시킵니다.
 */
export default function SearchSection() {
  return (
    <section className="relative bg-gray-900 w-full py-16 border-t border-gray-800 overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-grid-gray-800/20 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <form
            action={handleSearch}
            className="group relative flex items-center bg-gray-800/50 rounded-full shadow-2xl border border-gray-700 backdrop-blur-sm 
                       transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"
          >
            <div className="pl-6 pr-2 text-gray-500">
              <FaSearch className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="q"
              placeholder="궁금한 기술이나 키워드를 검색해보세요..."
              className="w-full bg-transparent text-lg text-white placeholder-gray-500 focus:outline-none px-4 py-4"
              required
            />
            <button
              type="submit"
              className="m-1.5 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full 
                         hover:scale-105 transform transition-transform duration-200 focus:outline-none 
                         focus:ring-4 focus:ring-blue-500/50 flex items-center gap-2"
              aria-label="검색 실행"
            >
              <FaSearch className="group-hover:scale-110 transition-transform" />
              <span>검색</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
