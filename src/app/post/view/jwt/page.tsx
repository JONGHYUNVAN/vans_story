import { getPostList } from '@/app/api/posts/actions/client';
import { SidebarWrapper } from '../utils/SidebarWrapper';
import JWTLayout from './JWTLayout';
import JWTList from './JWTList';



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