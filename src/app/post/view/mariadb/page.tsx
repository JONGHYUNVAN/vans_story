import { getPostList } from '@/lib/posts/clientActions';
import MariadbLayout from '@/app/post/view/mariadb/_components/MariadbLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import MariadbList from '@/app/post/view/mariadb/_components/MariadbList';

export default async function Page() {
  const posts = await getPostList('mariadb', undefined, 1, 10);
  return (
    <SidebarWrapper>
      <MariadbLayout title="MariaDB">
        <MariadbList posts={posts} />
      </MariadbLayout>
    </SidebarWrapper>
  );
} 