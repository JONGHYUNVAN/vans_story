import { API_URLS } from '@/constants/apiUrl';
import MariadbLayout from '../../MariadbLayout';
import { SidebarWrapper } from '../../../utils/SidebarWrapper';
import MariadbList from '../../MariadbList';
import { getPostList } from '@/app/post/view/utils/api/getPostList';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function MariadbCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const posts = await getPostList('mariadb', category);
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <SidebarWrapper>
      <MariadbLayout title={`MariaDB - ${categoryTitle}`}>
        <MariadbList posts={posts} />
      </MariadbLayout>
    </SidebarWrapper>
  );
} 