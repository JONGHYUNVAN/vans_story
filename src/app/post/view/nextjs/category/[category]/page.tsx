import { API_URLS } from '@/constants/apiUrl';
import NextjsLayout from '../../NextjsLayout';
import { SidebarWrapper } from '../../../components/SidebarWrapper';
import NextjsList from '../../NextjsList';
import { getPostList } from '@/lib/posts/client-actions';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  
  // 해당 카테고리의 게시글 목록을 조회
  const posts = await getPostList('nextjs', category);
  
  return (
    <SidebarWrapper>
      <NextjsLayout title={`Next.js - ${category}`}>
        {posts.length > 0 ? (
          <NextjsList posts={posts} />
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">게시글이 없습니다</h2>
              <p className="text-gray-400">
                '{category}' 카테고리에 등록된 게시글이 없습니다.
              </p>
            </div>
          </div>
        )}
      </NextjsLayout>
    </SidebarWrapper>
  );
} 