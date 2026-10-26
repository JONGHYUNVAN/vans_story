import { Suspense } from 'react';
import SearchHeader from '@/components/features/search/SearchHeader';
import SearchResultContent from '@/components/features/search/SearchResultContent';

type PageProps = {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

/**
 * 검색 결과 페이지
 * - URL의 'q' 파라미터를 이용해 검색 결과를 표시합니다.
 */
export default async function SearchPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const rawQuery = sp.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] : (rawQuery ?? '');

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white">
      {/* 메인 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700/40 via-gray-800/60 to-black"></div>

      {/* 미세한 텍스처 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-slate-600/[0.05]"></div>

      {/* 내부 그림자 효과 */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]"></div>

      {/* 세련된 배경 요소들 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 대형 그라데이션 오브 */}
        <div className="absolute -right-1/2 -top-1/2 h-[800px] w-[800px] animate-pulse rounded-full bg-gradient-to-br from-white/[0.08] via-gray-300/[0.04] to-transparent blur-3xl"></div>

        {/* 중형 그라데이션 오브 */}
        <div
          className="absolute -left-1/3 top-1/3 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-tr from-slate-400/[0.12] via-gray-500/[0.06] to-transparent blur-3xl"
          style={{ animationDelay: '2s' }}
        ></div>

        {/* 소형 그라데이션 오브 */}
        <div
          className="absolute -bottom-1/4 right-1/4 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-tl from-white/[0.1] via-transparent to-gray-400/[0.05] blur-3xl"
          style={{ animationDelay: '4s' }}
        ></div>

        {/* 미세한 하이라이트 */}
        <div className="absolute left-1/2 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>

        {/* 사이드 하이라이트 */}
        <div className="absolute left-0 top-1/2 h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>
        <div className="absolute right-0 top-1/2 h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>

        {/* 메쉬 그라데이션 효과 */}
        <div
          className="absolute inset-0 animate-spin bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.02)_60deg,transparent_120deg,rgba(255,255,255,0.015)_180deg,transparent_240deg,rgba(255,255,255,0.025)_300deg,transparent_360deg)]"
          style={{ animationDuration: '60s' }}
        ></div>

        {/* 글로우 효과 */}
        <div
          className="absolute left-1/4 top-1/4 h-3 w-3 animate-pulse rounded-full bg-white/40 blur-md"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute right-1/3 top-3/4 h-2 w-2 animate-pulse rounded-full bg-white/50 blur-md"
          style={{ animationDelay: '3s' }}
        ></div>
        <div
          className="absolute bottom-1/3 left-2/3 h-2.5 w-2.5 animate-pulse rounded-full bg-white/30 blur-md"
          style={{ animationDelay: '5s' }}
        ></div>
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4 py-8">
        <SearchHeader query={query} />
        <Suspense fallback={<SearchResultListSkeleton />}>
          <SearchResultContent query={query} />
        </Suspense>
      </div>
    </div>
  );
}

/** 스켈레톤 UI */
function SearchResultListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="group relative animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="space-y-4">
            <div className="h-7 w-3/4 rounded-lg bg-gradient-to-r from-white/20 to-gray-300/20"></div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-white/10"></div>
              <div className="h-4 w-5/6 rounded bg-white/10"></div>
              <div className="h-4 w-4/6 rounded bg-white/10"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full bg-white/10"></div>
              <div className="h-6 w-20 rounded-full bg-white/10"></div>
              <div className="h-6 w-14 rounded-full bg-white/10"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
