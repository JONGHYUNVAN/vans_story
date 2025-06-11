import { API_URLS } from '@/constants/apiUrl';
import MongodbLayout from '../../MongodbLayout';
import { SidebarWrapper } from '../../../utils/SidebarWrapper';
import MongodbList from '../../MongodbList';
import { getPostList } from '@/app/post/view/utils/api/getPostList';

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