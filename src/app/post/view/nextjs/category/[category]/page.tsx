import { API_URLS } from '@/constants/apiUrl';
import NextjsLayout from '../../NextjsLayout';
import { SidebarWrapper } from '../../../components/SidebarWrapper';
import NextjsList from '../../NextjsList';
import { getPostList } from '@/lib/posts/client-actions';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const posts = await getPostList('nextjs', category);
  return (
    <SidebarWrapper>
      <NextjsLayout title={`Next.js - ${category}`}>
        <NextjsList posts={posts} />
      </NextjsLayout>
    </SidebarWrapper>
  );
} 