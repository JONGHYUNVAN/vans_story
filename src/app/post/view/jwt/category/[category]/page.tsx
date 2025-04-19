import { API_URLS } from '@/api/constants/apiUrl';
import { SidebarWrapper } from '../../../common/SidebarWrapper';
import JWTLayout from '../../JWTLayout';
import JWTList from '../../JWTList';
import { handleEmptyData } from '@/utils/errorHandling';
import { FrameworkPost } from '@/types/FrameworkPost';

interface Post extends FrameworkPost {
  _id: string;
}

interface PageProps {
  params: Promise<{ category: string }>;
}

async function getPosts(category: string): Promise<Post[]> {
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
  // 데이터가 없으면 404 페이지 표시
  const posts = handleEmptyData<Post>(await getPosts(category));

  return (
    <SidebarWrapper>
      <JWTLayout>
        <JWTList posts={posts} />
      </JWTLayout>
    </SidebarWrapper>
  );
} 