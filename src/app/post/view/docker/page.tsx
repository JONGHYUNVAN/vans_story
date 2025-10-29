import { getPostList } from '@/lib/posts/client-actions';
import DockerLayout from './DockerLayout';
import { SidebarWrapper } from '../components/SidebarWrapper';
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