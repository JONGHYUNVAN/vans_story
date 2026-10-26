import { getPostList } from '@/lib/posts/clientActions';
import NestjsLayout from '@/app/post/view/nestjs/_components/NestjsLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import NestjsList from '@/app/post/view/nestjs/_components/NestjsList';




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