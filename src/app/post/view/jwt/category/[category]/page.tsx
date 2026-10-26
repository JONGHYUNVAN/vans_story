import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import JWTLayout from '@/app/post/view/jwt/_components/JWTLayout';
import JWTList from '@/app/post/view/jwt/_components/JWTList';
import { handleEmptyData } from '@/lib/errors/errorHandling';
import { getPostList } from '@/lib/posts/clientActions';
import type { PostInfo } from '@/types/post';

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
