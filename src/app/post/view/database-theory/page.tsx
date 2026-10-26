import DatabaseTheoryList from '@/app/post/view/database-theory/_components/DatabaseTheoryList';
import DatabaseTheoryLayout from '@/app/post/view/database-theory/_components/DatabaseTheoryLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import { getPostList } from '@/lib/posts/clientActions';

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
