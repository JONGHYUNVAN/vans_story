import { SidebarWrapper } from '../../../components/SidebarWrapper';
import JWTLayout from '../../JWTLayout';
import JWTList from '../../JWTList';
import { handleEmptyData } from '@/utils/errorHandling';
import { getPostList } from '@/lib/posts/client-actions';
import { PostInfo } from '@/interfaces/post/types';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const posts = handleEmptyData<PostInfo>(await getPostList('jwt', category));

  return (
    <SidebarWrapper>
      <JWTLayout>
        <JWTList posts={posts} />
      </JWTLayout>
    </SidebarWrapper>
  );
} 