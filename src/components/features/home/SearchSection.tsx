'use client';

import { useState, useEffect } from 'react';
import { handleSearch } from '@/app/search/actions';
import { ApiFetch } from '@/lib/apiFetch';
import { useRouter } from 'next/navigation';
import { AutocompleteInput } from '@/components/ui/AutocompleteInput';
import { AutocompleteSuggestion } from '@/types/api/search';

/**
 * 홈페이지 검색 섹션 컴포넌트 (서버 액션 + 클라이언트 상태 관리)
 * - 사용자가 검색어를 입력하고 검색을 실행할 수 있는 UI를 제공합니다.
 * - 폼 제출 시 서버 액션을 통해 /search 경로로 이동시킵니다.
 * - API에서 인기 검색어를 동적으로 가져옵니다.
 */
export default function SearchSection() {
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // API에서 인기 검색어 가져오기
  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        const response = await ApiFetch.getPopularSearches();
        if (response.ok) {
          const responseData = await response.json();
          console.log('🔍 Frontend - Received data:', responseData);
          
          // BFF 프록시에서 { success: true, data: {...} } 구조로 반환
          const data = responseData.success && responseData.data ? responseData.data : responseData;
          
          if (data.popular_searches && Array.isArray(data.popular_searches)) {
            // 객체 배열에서 query 필드 추출하고 중복 제거
            const uniqueSearches = [...new Set(
              data.popular_searches
                .filter((item: any) => item && typeof item.query === 'string')
                .map((item: any) => item.query.trim())
                .filter((query: string) => query.length > 0)
            )];
            
            if (uniqueSearches.length > 0) {
              setPopularSearches(uniqueSearches as string[]);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch popular searches:', error);
        // 기본값 유지
      }
    };

    fetchPopularSearches();
  }, []);

  // 인기 검색어 클릭 핸들러
  const handlePopularSearchClick = (searchTerm: string) => {
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  // 자동완성 제안 선택 핸들러
  const handleAutocompleteSelect = (suggestion: AutocompleteSuggestion) => {
    router.push(`/search?q=${encodeURIComponent(suggestion.text)}`);
  };

  // 폼 제출 핸들러
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
         <section className="relative w-full py-20 pb-32 bg-black overflow-hidden">
             <div className="container mx-auto px-4">
         <div className="max-w-4xl mx-auto pt-24">
          <form
            onSubmit={handleFormSubmit}
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
            <AutocompleteInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSelect={handleAutocompleteSelect}
              placeholder="Spring Boot, JWT, Database, algorithm..."
              className="flex-1"
              inputClassName="w-full bg-transparent text-lg text-white placeholder-gray-500 focus:outline-none px-4 py-6
                           placeholder:text-gray-500 placeholder:text-base border-0 rounded-2xl"
              dropdownClassName=""
              minLength={2}
              limit={8}
              debounceMs={300}
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
              {popularSearches.map((tag, index) => (
                <button
                  key={`${tag}-${index}`}
                  onClick={() => handlePopularSearchClick(tag)}
                  className="px-3 py-1 bg-gray-800/50 text-gray-300 text-sm rounded-full border border-gray-700/50
                           hover:bg-gray-700/50 hover:border-gray-600/50 hover:text-white transition-all duration-200 cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
