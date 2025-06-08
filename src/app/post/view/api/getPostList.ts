import { API_URLS } from '@/api/constants/apiUrl';
import { PostInfo } from "@/interfaces/post/types";

export interface Post extends PostInfo {
  _id: string;
}

export async function getPostList(theme: string, category?: string, page = 1, limit = 10): Promise<Post[]> {
  try {
    const url = new URL(`${API_URLS.POST.LIST}`);
    url.searchParams.append('theme', theme);
    if (category) url.searchParams.append('category', category);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString(), {
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