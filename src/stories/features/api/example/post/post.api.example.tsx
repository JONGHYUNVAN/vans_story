import { PostApiCard } from '../../post.api.card';

interface Props {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: any;
}

export default function PostApiExample({ method = 'GET', body }: Props) {
  let sampleData: any = null;
  let status = 200;
  let endpoint = '/api/posts/1';

  if (method === 'GET') {
    sampleData = {
      "_id": "507f1f77bcf86cd799439011",
      "title": "게시글 제목",
      "content": "게시글 내용입니다.",
      "theme": "dark",
      "authorEmail": "user@example.com",
      "author": "닉네임",
      "createdAt": "2024-03-19T09:00:00.000Z",
      "updatedAt": "2024-03-19T09:00:00.000Z",
      "description": "게시글 설명입니다.",
      "tags": [
        "태그1",
        "태그2"
      ],
      "viewCount": 0,
      "likeCount": 0,
      "category": "introduction",
      "thumbnail": "thumbnail.jpg",
      "language": "ko",
      "topic": "Java 알고리즘"
    };
  } else if (method === 'POST') {
    sampleData = {
      id: 2,
      ...body,
      createdAt: '2024-01-01T00:00:00Z',
    };
    status = 200;
    endpoint = '/api/posts';
  } else if (method === 'PATCH') {
    sampleData = {
      "_id": "507f1f77bcf86cd799439011",
      "title": "게시글 제목",
      "content": "게시글 내용입니다.",
      "theme": "dark",
      "authorEmail": "user@example.com",
      "author": "닉네임",
      "createdAt": "2024-03-19T09:00:00.000Z",
      "updatedAt": "2024-03-19T09:00:00.000Z",
      "description": "게시글 설명입니다.",
      "tags": [
        "태그1",
        "태그2"
      ],
      "viewCount": 0,
      "likeCount": 0,
      "category": "introduction",
      "thumbnail": "thumbnail.jpg",
      "language": "ko",
      "topic": "Java 알고리즘"
    };
    endpoint = '/api/posts/1';
  } else if (method === 'DELETE') {
    sampleData = { success: true, message: '삭제되었습니다.' };
    status = 204;
    endpoint = '/api/posts/1';
  }

  return (
    <PostApiCard
      endpoint={endpoint}
      method={method}
      body={body}
      data={sampleData}
      status={status}
      error={null}
      loading={false}
    />
  );
} 