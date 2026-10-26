import DatabaseTheoryList from '@/app/post/view/database-theory/_components/DatabaseTheoryList';
import DatabaseTheoryLayout from '@/app/post/view/database-theory/_components/DatabaseTheoryLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import { getPostList } from '@/lib/posts/clientActions';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const posts = await getPostList('database-theory', category, 1, 10);

  return (
    <SidebarWrapper>
      <DatabaseTheoryLayout title={`Database Theory - ${category}`}>
        <DatabaseTheoryList posts={posts} />
      </DatabaseTheoryLayout>
    </SidebarWrapper>
  );
} 