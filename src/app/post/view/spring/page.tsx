import { getPostList } from '@/lib/posts/client-actions';
import SpringList from './SpringList';
import SpringLayout from './SpringLayout';
import { SidebarWrapper } from '../components/SidebarWrapper';



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