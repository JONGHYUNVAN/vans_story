import { API_URLS } from '@/constants/apiUrl';
import SpringList from '@/app/post/view/spring/SpringList';
import SpringLayout from '@/app/post/view/spring/SpringLayout';
import { SidebarWrapper } from '@/app/post/view/utils/SidebarWrapper';

interface PageProps {
  params: Promise<{ category: string }>;
}

async function getPosts(category: string) {
  const response = await fetch(`${API_URLS.POST.LIST}?theme=spring&category=${category}&page=1&limit=10`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  const data = await response.json();
  return (data.data || []).map((post: any) => ({
    ...post,
    id: post._id
  }));
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const posts = await getPosts(category);
  
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  
  return (
    <SidebarWrapper>
      <SpringLayout title={`Spring - ${categoryTitle}`}>
        <SpringList posts={posts} />
      </SpringLayout>
    </SidebarWrapper>
  );
}