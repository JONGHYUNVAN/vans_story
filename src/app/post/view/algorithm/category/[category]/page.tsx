import { API_URLS } from '@/api/constants/apiUrl';
import AlgorithmList from '../../AlgorithmList';

async function getPosts(category: string) {
  const response = await fetch(`${API_URLS.POST.LIST}?theme=algorithm&category=${category}&page=1&limit=10`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  const data = await response.json();
  return data.data || [];
}

export default async function Page({ params }: { params: { category: string } }) {
  const posts = await getPosts(params.category);
  return <AlgorithmList posts={posts} />;
} 