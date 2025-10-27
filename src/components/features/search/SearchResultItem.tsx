import { SearchResult } from '@/types/api/search';
import Link from 'next/link';

interface SearchResultItemProps {
  item: SearchResult;
}

/**
 * 개별 검색 결과 항목을 렌더링하는 컴포넌트
 */
export default function SearchResultItem({ item }: SearchResultItemProps) {
  // 백엔드에서 오는 하이라이트 HTML을 그대로 사용
  const title = (
    <h2
      className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-300"
      dangerouslySetInnerHTML={{ __html: item.highlight?.title?.[0] || item.title }}
    />
  );

  // 하이라이트된 description 또는 일반 content 사용
  const highlightedContent = item.highlight?.description?.[0] || item.content || item.summary || '';
  const contentHtml = highlightedContent.replace(/\n/g, '<br />').substring(0, 300) + (highlightedContent.length > 300 ? '...' : '');
  
  const content = (
    <p
      className="text-white/70 mt-4 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );

  return (
    <Link
      href={`/post/view/${item.theme}/${item.post_id}`}
      className="group block relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/10 transform hover:-translate-y-1"
    >
      {/* 호버 시 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* 메인 컨텐츠 */}
      <div className="relative p-6 sm:p-8">
         {/* 제목 */}
         {title}

        {/* 컨텐츠 */}
        {content}
      </div>

    </Link>
  );
}
