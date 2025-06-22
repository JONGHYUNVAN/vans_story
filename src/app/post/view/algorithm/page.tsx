import { getPostList } from '@/app/api/posts/actions/client';
import AlgorithmList from './AlgorithmList';
import AlgorithmLayout from './AlgorithmLayout';
import { SidebarWrapper } from '../utils/SidebarWrapper';
export default async function Page() {
  const posts = await getPostList('algorithm', undefined, 1, 10);
  return (
    <SidebarWrapper>
    <AlgorithmLayout title="Algorithm">
      <AlgorithmList posts={posts} />
    </AlgorithmLayout>
    </SidebarWrapper>
  );
} 