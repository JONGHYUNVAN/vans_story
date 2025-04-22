import { SidebarWrapper } from '../../../common/SidebarWrapper';
import JWTLayout from '../../JWTLayout';
import JWTList from '../../JWTList';
import { handleEmptyData } from '@/utils/errorHandling';
import { getPostList, Post } from '@/app/post/view/api/getPostList';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const posts = handleEmptyData<Post>(await getPostList('jwt', category));

  return (
    <SidebarWrapper>
      <JWTLayout>
        <JWTList posts={posts} />
      </JWTLayout>
    </SidebarWrapper>
  );
} 