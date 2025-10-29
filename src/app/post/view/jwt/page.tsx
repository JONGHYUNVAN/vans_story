import { getPostList } from '@/lib/posts/client-actions';
import { SidebarWrapper } from '../components/SidebarWrapper';
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