import { getPostList } from '@/lib/posts/client-actions';
import NestjsLayout from './NestjsLayout';
import { SidebarWrapper } from '../components/SidebarWrapper';
import NestjsList from './NestjsList';




export default async function Page() {
  const posts = await getPostList('nestjs', undefined, 1, 10);
  return (
    <SidebarWrapper>
      <NestjsLayout title="Nest.js">
        <NestjsList posts={posts} />
      </NestjsLayout>
    </SidebarWrapper>
  );
} 