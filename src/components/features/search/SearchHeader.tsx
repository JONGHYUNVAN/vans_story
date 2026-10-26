'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { AutocompleteInput } from '@/components/ui/AutocompleteInput';
import type { AutocompleteSuggestion } from '@/types/api/search';

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
      <form onSubmit={handleFormSubmit} className="relative mb-8 flex items-center">
        <div className="group relative flex-1">
          <AutocompleteInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={handleAutocompleteSelect}
            placeholder="다시 검색..."
            className="flex-1"
            inputClassName="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-lg text-white placeholder-white/60 focus:outline-hidden focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 px-6 py-4 pr-16 transition-all duration-300 hover:bg-white/15 hover:border-white/30"
            dropdownClassName="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl mt-2 overflow-hidden"
            minLength={2}
            limit={8}
            debounceMs={300}
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <button
          type="submit"
          className="absolute right-3 transform rounded-xl bg-linear-to-r from-purple-500 to-blue-500 p-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-blue-600 hover:shadow-purple-500/25 focus:ring-2 focus:ring-purple-400/50 focus:outline-hidden"
          aria-label="검색 실행"
        >
          <FaSearch className="h-4 w-4" />
        </button>
      </form>

      {/* 검색 결과 제목 */}
      {query && (
        <div className="text-center">
          <h1 className="mb-2 bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-4xl font-bold text-transparent">
            검색 결과
          </h1>
          <p className="text-xl text-white/80">
            <span className="text-white/60">&quot;</span>
            <span className="font-semibold text-purple-300">{query}</span>
            <span className="text-white/60">&quot;</span>
            <span className="text-white/70"> 에 대한 결과입니다</span>
          </p>
        </div>
      )}
    </header>
  );
}
