import { getPostList } from '@/lib/posts/clientActions';
import AlgorithmList from '@/app/post/view/algorithm/_components/AlgorithmList';
import AlgorithmLayout from '@/app/post/view/algorithm/_components/AlgorithmLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
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
