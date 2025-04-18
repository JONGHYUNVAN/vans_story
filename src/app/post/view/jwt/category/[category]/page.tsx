import { API_URLS } from '@/api/constants/apiUrl';
import { notFound } from 'next/navigation';
import { SidebarWrapper } from '../../../common/SidebarWrapper';
import JWTLayout from '../../JWTLayout';
import JWTList from '../../JWTList';

interface PageProps {
  params: Promise<{ category: string }>;
}

async function getPosts(category: string) {
  try {
    const response = await fetch(`${API_URLS.POST.LIST}?theme=jwt&category=${category}&page=1&limit=10`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const posts = await getPosts(category);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <SidebarWrapper>
      <JWTLayout>
        <JWTList posts={posts} />
      </JWTLayout>
    </SidebarWrapper>
  );
} 