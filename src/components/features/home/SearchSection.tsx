import { handleSearch } from '@/app/search/actions';

/**
 * 홈페이지 검색 섹션 컴포넌트 (서버 액션 사용)
 * - 사용자가 검색어를 입력하고 검색을 실행할 수 있는 UI를 제공합니다.
 * - 폼 제출 시 서버 액션을 통해 /search 경로로 이동시킵니다.
 */
export default function SearchSection() {
  return (
         <section className="relative w-full py-20 pb-32 bg-black overflow-hidden">
      
      {/* 별 효과 */}
      <div className="absolute inset-0">
        <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-3/4 left-1/2 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-yellow-200 rounded-full animate-pulse delay-1500"></div>
        
                 {/* 추가 별들 - 더 부드러운 색상과 고른 분포 */}
         <div className="absolute top-2/6 left-1/6 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-500"></div>
         <div className="absolute top-2/3 right-1/6 w-0.5 h-0.5 bg-blue-200/50 rounded-full animate-pulse delay-1500"></div>
         <div className="absolute bottom-2/3 left-1/3 w-1 h-1 bg-purple-200/40 rounded-full animate-pulse delay-3000"></div>
         <div className="absolute top-3/4 right-1/2 w-0.5 h-0.5 bg-cyan-200/50 rounded-full animate-pulse delay-2500"></div>
         
         <div className="absolute top-4/5 right-1/5 w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse delay-700"></div>
         <div className="absolute bottom-1/5 left-1/5 w-1 h-1 bg-blue-200/60 rounded-full animate-pulse delay-1200"></div>
         <div className="absolute top-4/5 right-2/5 w-0.5 h-0.5 bg-purple-200/60 rounded-full animate-pulse delay-1800"></div>
         
         <div className="absolute top-5/8 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-400"></div>
         <div className="absolute top-5/6 right-1/4 w-0.5 h-0.5 bg-blue-200/40 rounded-full animate-pulse delay-1600"></div>
         <div className="absolute bottom-1/6 left-2/3 w-1 h-1 bg-purple-200/50 rounded-full animate-pulse delay-2200"></div>
         <div className="absolute top-7/12 right-1/3 w-0.5 h-0.5 bg-white/50 rounded-full animate-pulse delay-900"></div>
         
         <div className="absolute top-3/5 left-1/8 w-1 h-1 bg-blue-200/40 rounded-full animate-pulse delay-1100"></div>
         <div className="absolute bottom-2/5 right-1/8 w-0.5 h-0.5 bg-purple-200/50 rounded-full animate-pulse delay-1900"></div>
         <div className="absolute top-7/8 left-1/2 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-2800"></div>
         <div className="absolute bottom-1/8 right-1/2 w-0.5 h-0.5 bg-blue-200/50 rounded-full animate-pulse delay-1400"></div>
         
         {/* 하단 별들 추가 */}
         <div className="absolute bottom-1/4 left-1/6 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse delay-800"></div>
         <div className="absolute bottom-1/5 right-1/6 w-1 h-1 bg-blue-200/50 rounded-full animate-pulse delay-1300"></div>
         <div className="absolute bottom-1/6 left-1/4 w-0.5 h-0.5 bg-purple-200/40 rounded-full animate-pulse delay-1700"></div>
         <div className="absolute bottom-1/8 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-2100"></div>
      </div>
      
             <div className="container mx-auto px-4 relative z-10">
         <div className="max-w-4xl mx-auto pt-24">
          <form
            action={handleSearch}
            className="group relative flex items-center bg-gray-800/30 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-xl 
                       transition-all duration-500 hover:bg-gray-800/40 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/20
                       hover:shadow-blue-500/10"
          >
            <div className="pl-6 pr-2 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300">
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              name="q"
              placeholder="React, TypeScript, Docker, Kubernetes..."
              className="w-full bg-transparent text-lg text-white placeholder-gray-500 focus:outline-none px-4 py-6
                         placeholder:text-gray-500 placeholder:text-base"
              required
            />
            <button
              type="submit"
              className="m-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl 
                         hover:from-blue-600 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-500/20 
                         transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 
                         flex items-center gap-2 active:scale-95 group/btn"
              aria-label="검색 실행"
            >
              <svg 
                className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <span className="text-sm font-semibold tracking-wide">SEARCH</span>
            </button>
          </form>
          
          {/* 인기 검색어 */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-3">인기 검색어</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['React', 'TypeScript', 'Next.js', 'Docker', 'Kubernetes', 'Spring Boot'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-800/50 text-gray-300 text-sm rounded-full border border-gray-700/50
                           hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-200 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
