import NestjsLayout from '@/app/post/view/nestjs/_components/NestjsLayout';
import { SidebarWrapper } from '@/app/post/view/_components/SidebarWrapper';
import NestjsList from '@/app/post/view/nestjs/_components/NestjsList';
import { getPostList } from '@/lib/posts/clientActions';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const posts = await getPostList('nestjs', category);
  return (
    <SidebarWrapper>
      <NestjsLayout title={`Nest.js - ${category}`}>
        <NestjsList posts={posts} />
      </NestjsLayout>
    </SidebarWrapper>
  );
}
