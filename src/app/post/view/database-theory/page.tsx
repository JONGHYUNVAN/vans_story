import DatabaseTheoryList from './DatabaseTheoryList';
import DatabaseTheoryLayout from './DatabaseTheoryLayout';
import { SidebarWrapper } from '../utils/SidebarWrapper';
import { getPostList } from '@/app/api/posts/actions/client';



export default async function Page() {
  const posts = await getPostList('database-theory', undefined, 1, 10);
  return (
    <SidebarWrapper>
      <DatabaseTheoryLayout title="Database Theory">
        <DatabaseTheoryList posts={posts} />
      </DatabaseTheoryLayout>
    </SidebarWrapper>
  );
} 