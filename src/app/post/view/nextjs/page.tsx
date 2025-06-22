import NextjsLayout from './NextjsLayout';
import { SidebarWrapper } from '../utils/SidebarWrapper';
import NextjsList from './NextjsList';
import { getPostList } from '@/app/api/posts/actions/client';

export default async function Page() {
  const posts = await getPostList('nextjs', undefined, 1, 10);
  return (
    <SidebarWrapper>
      <NextjsLayout title="Next.js">
        <NextjsList posts={posts} />
      </NextjsLayout>
    </SidebarWrapper>
  );
} 