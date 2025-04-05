import { API_URLS } from '@/api/constants/apiUrl';
import MariadbLayout from '../../MariadbLayout';
import { SidebarWrapper } from '../../../common/SidebarWrapper';
import MariadbList from '../../MariadbList';

interface PageProps {
  params: {
    category: string;
  };
}

async function getPostsByCategory(category: string) {
  const response = await fetch(`${API_URLS.POST.LIST}?theme=mariadb&category=${category}&page=1&limit=10`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  const data = await response.json();
  return data.data || [];
}

export default async function MariadbCategoryPage({ params }: PageProps) {
  const posts = await getPostsByCategory(params.category);
  const categoryTitle = params.category.charAt(0).toUpperCase() + params.category.slice(1);

  return (
    <SidebarWrapper>
      <MariadbLayout title={`MariaDB - ${categoryTitle}`}>
        <MariadbList posts={posts} />
      </MariadbLayout>
    </SidebarWrapper>
  );
} 