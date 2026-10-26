import { API_URLS } from '@/constants/apiUrl';
import MariadbLayout from '@/app/post/view/mariadb/_components/MariadbLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import MariadbList from '@/app/post/view/mariadb/_components/MariadbList';
import { getPostList } from '@/lib/posts/clientActions';

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
