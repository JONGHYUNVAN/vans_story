import { getPostList } from '@/lib/posts/clientActions';
import MongodbLayout from '@/app/post/view/mongodb/_components/MongodbLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import MongodbList from '@/app/post/view/mongodb/_components/MongodbList';

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
