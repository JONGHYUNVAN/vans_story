import DatabaseTheoryList from '../../DatabaseTheoryList';
import DatabaseTheoryLayout from '../../DatabaseTheoryLayout';
import { SidebarWrapper } from '../../../components/SidebarWrapper';
import { getPostList } from '@/lib/posts/client-actions';

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