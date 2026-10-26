import MongodbLayout from '@/app/post/view/mongodb/_components/MongodbLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import MongodbList from '@/app/post/view/mongodb/_components/MongodbList';
import { getPostList } from '@/lib/posts/clientActions';

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
