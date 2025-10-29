import { API_URLS } from '@/constants/apiUrl';
import NestjsLayout from '../../NestjsLayout';
import { SidebarWrapper } from '../../../components/SidebarWrapper';
import NestjsList from '../../NestjsList';
import { getPostList } from '@/lib/posts/client-actions';

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