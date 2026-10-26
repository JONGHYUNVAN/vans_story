import { getPostList } from '@/lib/posts/clientActions';
import DockerLayout from '@/app/post/view/docker/_components/DockerLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import DockerList from '@/app/post/view/docker/_components/DockerList';


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