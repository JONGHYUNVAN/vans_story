'use client';

import { useState, useEffect } from 'react';
import { ApiFetch } from '@/lib/api/apiFetch';
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
    // 검색어가 없으면 요청하지 않음 (빈 결과는 렌더 시 파생)
    if (!query) return;

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
        setError(
          err instanceof Error ? err.message : '검색 결과를 불러오는 중 오류가 발생했습니다.',
        );
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
      <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center backdrop-blur-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r from-red-500/20 to-pink-500/20">
          <svg
            className="h-8 w-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="mb-2 text-lg font-medium text-red-400">{error}</p>
        <p className="text-white/60">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  // 검색어가 비어 있으면 이전 결과 대신 빈 결과를 보여준다
  if (!query) {
    return <SearchResultList results={[]} total={0} />;
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
          className="group relative animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/5 to-transparent" />
          <div className="space-y-4">
            <div className="h-7 w-3/4 rounded-lg bg-linear-to-r from-purple-400/20 to-blue-400/20" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded-sm bg-white/10" />
              <div className="h-4 w-5/6 rounded-sm bg-white/10" />
              <div className="h-4 w-4/6 rounded-sm bg-white/10" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full bg-white/10" />
              <div className="h-6 w-20 rounded-full bg-white/10" />
              <div className="h-6 w-14 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
