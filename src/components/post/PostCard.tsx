interface BasePost {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  topic?: string;
  author?: string;
}

interface PostCardProps<T extends BasePost> {
  post: T;
  renderBadge?: (post: T) => React.ReactNode;
}

export default function PostCard<T extends BasePost>({ 
  post, 
  renderBadge 
}: PostCardProps<T>) {
  return (
    <article className="group relative rounded-lg border border-transparent bg-gradient-to-b from-zinc-900 to-zinc-900/80 p-6 backdrop-blur-md hover:border-zinc-700/50">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-medium text-zinc-200 group-hover:text-white transition-colors">
          {post.title}
        </h2>
        <div className="flex items-center gap-3">
          {post.author && (
            <span className="text-xs text-zinc-500">by. {post.author}</span>
          )}
          {renderBadge && renderBadge(post)}
        </div>
      </div>
      
      {post.topic && (
        <p className="text-xs text-zinc-500 mb-3 -mt-1">{post.topic}</p>
      )}
      
      <p className="text-zinc-400 text-sm mb-4 w-full">
        {post.description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-4">
          <span>조회 {post.viewCount}</span>
          <span>좋아요 {post.likeCount}</span>
        </div>
        <div className="flex items-center gap-2">
          {post.tags.map(tag => (
            <span 
              key={tag}
              className="px-2 py-1 bg-zinc-800/50 text-zinc-400 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
} 