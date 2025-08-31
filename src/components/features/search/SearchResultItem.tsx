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
  const title = item.highlight?.title ? (
    <h2
      className="text-2xl font-bold text-blue-400 group-hover:underline"
      dangerouslySetInnerHTML={{ __html: item.highlight.title }}
    />
  ) : (
    <h2 className="text-2xl font-bold text-blue-400 group-hover:underline">{item.title}</h2>
  );

  const snippet = item.highlight?.content || item.highlight?.summary;
  const summary = snippet ? (
    <p
      className="text-gray-400 mt-2"
      dangerouslySetInnerHTML={{ __html: snippet }}
    />
  ) : (
    <p className="text-gray-400 mt-2">{item.summary}</p>
  );

  return (
    <Link href={`/post/${item.slug}`} legacyBehavior>
      <a className="block bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group">
        {title}
        {summary}
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
      </a>
    </Link>
  );
}
