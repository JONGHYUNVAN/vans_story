import { API_URLS } from '@/api/constants/apiUrl';
import MariadbLayout from './MariadbLayout';
import { SidebarWrapper } from '../common/SidebarWrapper';
import MariadbList from './MariadbList';

async function getPosts() {
  const response = await fetch(`${API_URLS.POST.LIST}?theme=mariadb&page=1&limit=10`, {
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
      <MariadbLayout title="MariaDB">
        <MariadbList posts={posts} />
      </MariadbLayout>
    </SidebarWrapper>
  );
} 