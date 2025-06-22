import { API_URLS } from '@/constants/apiUrl';
import NestjsLayout from '../../NestjsLayout';
import { SidebarWrapper } from '../../../utils/SidebarWrapper';
import NestjsList from '../../NestjsList';
import { getPostList } from '@/app/api/posts/actions/client';

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