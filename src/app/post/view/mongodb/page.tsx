import { API_URLS } from '@/constants/apiUrl';
import MongodbLayout from './MongodbLayout';
import { SidebarWrapper } from '../utils/SidebarWrapper';
import MongodbList from './MongodbList';

async function getPosts() {
  const response = await fetch(`${API_URLS.POST.LIST}?theme=mongodb&page=1&limit=10`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  const data = await response.json();
  return data.data || [];
}

export default async function Page() {
  const posts = await getPosts();
  return (
    <SidebarWrapper>
      <MongodbLayout title="MongoDB">
        <MongodbList posts={posts} />
      </MongodbLayout>
    </SidebarWrapper>
  );
} 