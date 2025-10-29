'use client';

import { useState, useEffect } from 'react';
import { ApiFetch } from '@/lib/apiFetch';
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
      <div className="text-center py-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-400 text-lg font-medium mb-2">{error}</p>
        <p className="text-white/60">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  return <SearchResultList results={results} total={total} />;
}

/** 스켈레톤 UI */
function SearchResultListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i} 
          className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
          <div className="space-y-4">
            <div className="h-7 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-lg w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
              <div className="h-4 bg-white/10 rounded w-4/6"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-white/10 rounded-full w-16"></div>
              <div className="h-6 bg-white/10 rounded-full w-20"></div>
              <div className="h-6 bg-white/10 rounded-full w-14"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
