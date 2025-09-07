import { SearchResult } from '@/types/api/search';
import Link from 'next/link';
import { FaRegCalendarAlt, FaTags } from 'react-icons/fa';

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
      className="text-2xl font-bold text-blue-400 group-hover:underline"
      dangerouslySetInnerHTML={{ __html: item.highlight?.title?.[0] || item.title }}
    />
  );

  // 하이라이트된 description 또는 일반 content 사용
  const highlightedContent = item.highlight?.description?.[0] || item.content || item.summary || '';
  const contentHtml = highlightedContent.replace(/\n/g, '<br />');
  const content = (
    <p
      className="text-gray-400 mt-2"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );

  return (
    (<Link
      href={`/post/view/${item.category}/${item.post_id}`}
      className="block bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group"
    >
      {title}
      {content}
      <div className="flex items-center flex-wrap gap-4 mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <FaRegCalendarAlt />
          <span>{new Date(item.updated_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaTags />
          {item.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-700 rounded-md text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>)
  );
}
