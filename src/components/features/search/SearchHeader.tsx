'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchHeaderProps {
  query: string;
}

/**
 * 검색 결과 페이지의 헤더 컴포넌트
 * - 검색창과 검색어 정보를 표시합니다.
 */
export default function SearchHeader({ query }: SearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState(query);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('q', searchQuery.trim());
      router.push(`/search?${newParams.toString()}`);
    }
  };

  return (
    <header className="mb-8">
      <form onSubmit={handleSearch} className="relative flex items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="다시 검색..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg text-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-3"
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
