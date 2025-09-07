'use client';

import { useState, useEffect } from 'react';
import { ApiFetch } from '@/app/api/apiFetch/apiFetch';
import SearchResultList from './SearchResultList';

interface SearchResultContentProps {
  query: string;
}

/**
 * 검색 결과를 실제로 렌더링하는 클라이언트 컴포넌트
 * ApiFetch를 사용하여 통일된 API 호출 패턴을 따릅니다.
 */
export default function SearchResultContent({ query }: SearchResultContentProps) {
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setTotal(0);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await ApiFetch.searchPosts(query);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || '검색 중 오류가 발생했습니다.');
        }
        
        const data = await response.json();
        setResults(data.results || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Search API call error:', err);
        setError(err instanceof Error ? err.message : '검색 결과를 불러오는 중 오류가 발생했습니다.');
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return <SearchResultListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-gray-800 rounded-lg">
        <p className="text-red-400">{error}</p>
        <p className="text-gray-400 mt-2">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  return <SearchResultList results={results} total={total} />;
}

/** 스켈레톤 UI */
function SearchResultListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg bg-gray-800 p-4 h-20" />
      ))}
    </div>
  );
}
