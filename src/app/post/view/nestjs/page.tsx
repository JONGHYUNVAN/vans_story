import { getPostList } from '@/app/api/posts/actions/client';
import NestjsLayout from './NestjsLayout';
import { SidebarWrapper } from '../utils/SidebarWrapper';
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