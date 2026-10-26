import { API_URLS } from '@/constants/apiUrl';
import DockerLayout from '@/app/post/view/docker/_components/DockerLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import DockerList from '@/app/post/view/docker/_components/DockerList';
import { getPostList } from '@/lib/posts/clientActions';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const posts = await getPostList('docker', category);

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <SidebarWrapper>
      <DockerLayout title={`Docker - ${categoryTitle}`}>
        <DockerList posts={posts} />
      </DockerLayout>
    </SidebarWrapper>
  );
}
