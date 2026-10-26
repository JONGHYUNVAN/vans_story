import NextjsLayout from '@/app/post/view/nextjs/_components/NextjsLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import NextjsList from '@/app/post/view/nextjs/_components/NextjsList';
import { getPostList } from '@/lib/posts/clientActions';

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
