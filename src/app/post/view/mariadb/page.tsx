import { getPostList } from '@/app/api/posts/actions/client';
import MariadbLayout from './MariadbLayout';
import { SidebarWrapper } from '../utils/SidebarWrapper';
import MariadbList from './MariadbList';

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