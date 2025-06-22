import { API_URLS } from '@/constants/apiUrl';
import DatabaseTheoryList from './DatabaseTheoryList';
import DatabaseTheoryLayout from './DatabaseTheoryLayout';
import { SidebarWrapper } from '../utils/SidebarWrapper';



export default async function Page() {
  const posts = await getPosts();
  return (
    <SidebarWrapper>
      <DatabaseTheoryLayout title="Database Theory">
        <DatabaseTheoryList posts={posts} />
      </DatabaseTheoryLayout>
    </SidebarWrapper>
  );
} 