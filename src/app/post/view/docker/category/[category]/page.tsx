import { API_URLS } from '@/constants/apiUrl';
import DockerLayout from '../../DockerLayout';
import { SidebarWrapper } from '../../../utils/SidebarWrapper';
import DockerList from '../../DockerList';
import { getPostList } from '@/app/post/view/utils/api/getPostList';

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