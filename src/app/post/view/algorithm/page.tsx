import { getPostList } from '@/lib/posts/client-actions';
import AlgorithmList from './AlgorithmList';
import AlgorithmLayout from './AlgorithmLayout';
import { SidebarWrapper } from '../components/SidebarWrapper';
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