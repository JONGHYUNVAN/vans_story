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
    <header className="mb-8">
      <form onSubmit={handleFormSubmit} className="relative flex items-center mb-4">
        <AutocompleteInput
          value={searchQuery}
          onChange={setSearchQuery}
          onSelect={handleAutocompleteSelect}
          placeholder="다시 검색..."
          className="flex-1"
          inputClassName="w-full bg-gray-800 border border-gray-700 rounded-lg text-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-3 pr-16"
          dropdownClassName="border-gray-600 bg-gray-800"
          minLength={2}
          limit={8}
          debounceMs={300}
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
