'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { handleSearch } from '@/app/search/actions';
import { AutocompleteInput } from '@/components/ui/AutocompleteInput';
import { AutocompleteSuggestion } from '@/types/api/search';
import { useRouter } from 'next/navigation';

interface SearchHeaderProps {
  query: string;
}

/**
 * 검색 결과 페이지의 헤더 컴포넌트 (서버 액션 사용)
 * - 검색창과 검색어 정보를 표시합니다.
 */
export default function SearchHeader({ query }: SearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState(query);
  const router = useRouter();

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
    <header className="mb-12">
      {/* 검색창 */}
      <form onSubmit={handleFormSubmit} className="relative flex items-center mb-8">
        <div className="relative flex-1 group">
          <AutocompleteInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={handleAutocompleteSelect}
            placeholder="다시 검색..."
            className="flex-1"
            inputClassName="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 px-6 py-4 pr-16 transition-all duration-300 hover:bg-white/15 hover:border-white/30"
            dropdownClassName="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl mt-2 overflow-hidden"
            minLength={2}
            limit={8}
            debounceMs={300}
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        <button
          type="submit"
          className="absolute right-3 p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
          aria-label="검색 실행"
        >
          <FaSearch className="w-4 h-4" />
        </button>
      </form>

      {/* 검색 결과 제목 */}
      {query && (
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            검색 결과
          </h1>
          <p className="text-xl text-white/80">
            <span className="text-white/60">"</span>
            <span className="font-semibold text-purple-300">{query}</span>
            <span className="text-white/60">"</span>
            <span className="text-white/70"> 에 대한 결과입니다</span>
          </p>
        </div>
      )}
    </header>
  );
}
