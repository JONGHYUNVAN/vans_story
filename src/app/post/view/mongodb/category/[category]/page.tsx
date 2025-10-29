import { API_URLS } from '@/constants/apiUrl';
import MongodbLayout from '../../MongodbLayout';
import { SidebarWrapper } from '../../../components/SidebarWrapper';
import MongodbList from '../../MongodbList';
import { getPostList } from '@/lib/posts/client-actions';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const posts = await getPostList('mongodb', category);
  return (
    <SidebarWrapper>
      <MongodbLayout title={`MongoDB - ${category}`}>
        <MongodbList posts={posts} />
      </MongodbLayout>
    </SidebarWrapper>
  );
} 