import { getPostList } from '@/lib/posts/clientActions';
import SpringList from '@/app/post/view/spring/_components/SpringList';
import SpringLayout from '@/app/post/view/spring/_components/SpringLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';



export default async function Page() {
  const posts = await getPostList('spring', undefined, 1, 10);
  
  return (
    <SidebarWrapper>
      <SpringLayout title="Spring">
        <SpringList posts={posts} />
      </SpringLayout>
    </SidebarWrapper>
  );
} 