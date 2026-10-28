import type { MetadataRoute } from 'next';
import { POST_THEME_KEYS } from '@/constants/postThemes';
import { SITE_URL } from '@/constants/site';

/** 빌드 시점엔 백엔드를 부르지 않으므로(getPostList와 같은 이유) 요청 시 만들고, 백엔드 호출은 1시간 캐시한다. */
export const dynamic = 'force-dynamic';

const STATIC_PATHS = ['', '/about-van', '/projects', '/games', '/stocks'];

/** Post BE 목록 limit 상한(MAX_POSTS_PER_PAGE) */
const PAGE_SIZE = 50;

interface PostListItem {
  _id: string;
  mainCategoryId?: { value?: string };
  updatedAt?: string;
}

async function fetchAllPosts(): Promise<PostListItem[]> {
  const apiUrl = process.env.POST_API_URL || 'http://localhost:3001/api/v1';
  const posts: PostListItem[] = [];

  for (let page = 1; ; page++) {
    const res = await fetch(`${apiUrl}/posts?page=${page}&limit=${PAGE_SIZE}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);

    const { data, meta } = await res.json();
    posts.push(...(data ?? []));
    if (!meta || page >= meta.totalPages) return posts;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = [...STATIC_PATHS, ...POST_THEME_KEYS.map((key) => `/post/view/${key}`)].map(
    (path) => ({ url: `${SITE_URL}${path}` }),
  );

  let posts: PostListItem[] = [];
  try {
    posts = await fetchAllPosts();
  } catch (error) {
    console.error('❌ sitemap: 게시글 목록 조회 실패', error);
  }

  const postEntries = posts
    .filter((post) => post.mainCategoryId?.value)
    .map((post) => {
      const lastModified = post.updatedAt ? new Date(post.updatedAt) : undefined;
      return {
        url: `${SITE_URL}/post/view/${post.mainCategoryId!.value}/${post._id}`,
        ...(lastModified && !isNaN(lastModified.getTime()) && { lastModified }),
      };
    });

  return [...staticEntries, ...postEntries];
}
