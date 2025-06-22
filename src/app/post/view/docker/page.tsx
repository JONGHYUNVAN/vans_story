import { getPostList } from '@/app/api/posts/actions/client';
import DockerLayout from './DockerLayout';
import { SidebarWrapper } from '../utils/SidebarWrapper';
import DockerList from './DockerList';


export default async function Page() {
  const posts = await getPostList('docker', undefined, 1, 10);
  return (
    <SidebarWrapper>
      <DockerLayout title="Docker">
        <DockerList posts={posts} />
      </DockerLayout>
    </SidebarWrapper>
  );
} 