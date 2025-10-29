import { getPostList } from '@/lib/posts/client-actions';
import MongodbLayout from './MongodbLayout';
import { SidebarWrapper } from '../components/SidebarWrapper';
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