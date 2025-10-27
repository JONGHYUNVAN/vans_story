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
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white relative overflow-hidden">
      {/* 메인 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700/40 via-gray-800/60 to-black"></div>
      
      {/* 미세한 텍스처 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-slate-600/[0.05]"></div>
      
      {/* 내부 그림자 효과 */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]"></div>
      
      {/* 세련된 배경 요소들 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 대형 그라데이션 오브 */}
        <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-br from-white/[0.08] via-gray-300/[0.04] to-transparent rounded-full blur-3xl animate-pulse"></div>
        
        {/* 중형 그라데이션 오브 */}
        <div className="absolute top-1/3 -left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-slate-400/[0.12] via-gray-500/[0.06] to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* 소형 그라데이션 오브 */}
        <div className="absolute -bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-white/[0.1] via-transparent to-gray-400/[0.05] rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* 미세한 하이라이트 */}
        <div className="absolute top-0 left-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
        
        {/* 사이드 하이라이트 */}
        <div className="absolute left-0 top-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>
        <div className="absolute right-0 top-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>
        
        {/* 메쉬 그라데이션 효과 */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.02)_60deg,transparent_120deg,rgba(255,255,255,0.015)_180deg,transparent_240deg,rgba(255,255,255,0.025)_300deg,transparent_360deg)] animate-spin" style={{animationDuration: '60s'}}></div>
        
        {/* 글로우 효과 */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/40 rounded-full blur-md animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-white/50 rounded-full blur-md animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/3 left-2/3 w-2.5 h-2.5 bg-white/30 rounded-full blur-md animate-pulse" style={{animationDelay: '5s'}}></div>
      </div>


      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
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
          className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
          <div className="space-y-4">
            <div className="h-7 bg-gradient-to-r from-white/20 to-gray-300/20 rounded-lg w-3/4"></div>
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
