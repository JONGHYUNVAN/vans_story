import { API_URLS } from '@/api/constants/apiUrl';
import DockerLayout from './DockerLayout';
import { SidebarWrapper } from '../common/SidebarWrapper';
import DockerList from './DockerList';


async function getPosts() {
  const response = await fetch(`${API_URLS.POST.LIST}?theme=docker&page=1&limit=10`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  const data = await response.json();
  return (data.data || []).map((post: any) => ({
    ...post,
    id: post._id
  }));
}

export default async function Page() {
  const posts = await getPosts();
  return (
    <SidebarWrapper>
      <DockerLayout title="Docker">
        <DockerList posts={posts} />
      </DockerLayout>
    </SidebarWrapper>
  );
} 