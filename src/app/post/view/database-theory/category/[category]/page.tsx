import { API_URLS } from '@/api/constants/apiUrl';
import DatabaseTheoryList from '../../DatabaseTheoryList';
import DatabaseTheoryLayout from '../../DatabaseTheoryLayout';
import { SidebarWrapper } from '../../../common/SidebarWrapper';

interface PageProps {
  params: Promise<{ category: string }>;
}

async function getPosts(category: string) {
  const response = await fetch(`${API_URLS.POST.LIST}?theme=database-theory&category=${category}&page=1&limit=10`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  const data = await response.json();
  return data.data || [];
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const posts = await getPosts(category);

  return (
    <SidebarWrapper>
      <DatabaseTheoryLayout title={`Database Theory - ${category}`}>
        <DatabaseTheoryList posts={posts} />
      </DatabaseTheoryLayout>
    </SidebarWrapper>
  );
} 