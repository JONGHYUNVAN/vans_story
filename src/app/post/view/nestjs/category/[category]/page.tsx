import { API_URLS } from '@/api/constants/apiUrl';
import NestjsLayout from '../../NestjsLayout';
import { SidebarWrapper } from '../../../common/SidebarWrapper';
import NestjsList from '../../NestjsList';

interface PageProps {
  params: Promise<{ category: string }>;
}

async function getPosts(category: string) {
  const response = await fetch(`${API_URLS.POST.LIST}?theme=nestjs&category=${category}&page=1&limit=10`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  const data = await response.json();
  return data.data || [];
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const posts = await getPosts(category);
  return (
    <SidebarWrapper>
      <NestjsLayout title={`Nest.js - ${category}`}>
        <NestjsList posts={posts} />
      </NestjsLayout>
    </SidebarWrapper>
  );
} 