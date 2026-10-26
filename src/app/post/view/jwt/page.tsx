import { getPostList } from '@/lib/posts/clientActions';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import JWTLayout from '@/app/post/view/jwt/_components/JWTLayout';
import JWTList from '@/app/post/view/jwt/_components/JWTList';

export default async function Page() {
  const posts = await getPostList('jwt', undefined, 1, 10);
  return (
    <SidebarWrapper>
      <JWTLayout title="JWT">
        <JWTList posts={posts} />
      </JWTLayout>
    </SidebarWrapper>
  );
}
