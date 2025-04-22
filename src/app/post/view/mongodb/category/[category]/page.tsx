import { API_URLS } from '@/api/constants/apiUrl';
import MongodbLayout from '../../MongodbLayout';
import { SidebarWrapper } from '../../../common/SidebarWrapper';
import MongodbList from '../../MongodbList';
import { getPostList } from '@/app/post/view/api/getPostList';

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