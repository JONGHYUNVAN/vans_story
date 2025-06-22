import { getPostList } from '@/app/api/posts/actions/client';
import MongodbLayout from './MongodbLayout';
import { SidebarWrapper } from '../utils/SidebarWrapper';
import MongodbList from './MongodbList';

export default async function Page() {
  const posts = await getPostList('mongodb', undefined, 1, 10);
  return (
    <SidebarWrapper>
      <MongodbLayout title="MongoDB">
        <MongodbList posts={posts} />
      </MongodbLayout>
    </SidebarWrapper>
  );
} 