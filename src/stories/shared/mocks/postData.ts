import { PostInfo } from '@/interfaces/post/types';

/**
 * 기본 포스트 모의 데이터 템플릿
 */
const basePostData: PostInfo = {
  id: '1',
  title: '기본 포스트 제목',
  description: '기본 포스트 설명입니다.',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  tags: ['tag1', 'tag2'],
  viewCount: 100,
  likeCount: 50,
  topic: '기본 주제',
  author: 'VanJS',
  thumbnail: '/default-thumbnail.webp',
  theme: 'default',
  category: 'general',
  language: 'ko'
};

/**
 * 프레임워크별 포스트 데이터 생성기
 */
export const createPostData = {
  /**
   * Algorithm 포스트 데이터 생성
   */
  algorithm: (overrides?: Partial<PostInfo>): PostInfo => ({
    ...basePostData,
    id: 'algorithm-1',
    title: '그래프 알고리즘: 다익스트라부터 벨만-포드까지',
    description: '그래프 알고리즘은 현대 컴퓨터 과학의 핵심이 되는 중요한 개념입니다.\n\n이 포스트에서는 다익스트라(Dijkstra), 벨만-포드(Bellman-Ford), 플로이드-워셜(Floyd-Warshall) 알고리즘의 원리와 구현 방법을 알아봅니다.\n\n시간/공간 복잡도 분석과 실전 문제 해결 전략도 다룹니다.',
    tags: ['Algorithm', 'Graph Theory', 'Computer Science'],
    viewCount: 845,
    likeCount: 112,
    topic: 'Algorithm Deep Dive',
    thumbnail: '/algorithm.webp',
    theme: 'algorithm',
    category: 'data-structures',
    ...overrides
  }),

  /**
   * Spring 포스트 데이터 생성
   */
  spring: (overrides?: Partial<PostInfo>): PostInfo => ({
    ...basePostData,
    id: 'spring-1',
    title: 'Spring Boot 3.0과 GraalVM으로 네이티브 이미지 만들기',
    description: 'Spring Boot 3.0의 새로운 기능들과 GraalVM을 활용한 네이티브 이미지 생성 방법을 알아봅니다.\n\n성능 최적화와 메모리 사용량 절약, 그리고 빠른 시작 시간을 달성하는 방법을 다룹니다.',
    tags: ['Spring Boot', 'GraalVM', 'Native Image', 'Performance'],
    viewCount: 672,
    likeCount: 89,
    topic: 'Spring Boot 3.0 & GraalVM',
    thumbnail: '/spring.webp',
    theme: 'spring',
    category: 'backend',
    ...overrides
  }),

  /**
   * Next.js 포스트 데이터 생성
   */
  nextjs: (overrides?: Partial<PostInfo>): PostInfo => ({
    ...basePostData,
    id: 'nextjs-1',
    title: 'Next.js 14 App Router와 Server Actions 완벽 가이드',
    description: 'Next.js 14의 App Router와 Server Actions를 활용한 풀스택 개발 방법을 알아봅니다.\n\nServer Components와 Client Components의 차이점, 그리고 최적의 성능을 위한 렌더링 전략을 다룹니다.',
    tags: ['Next.js', 'App Router', 'Server Actions', 'React'],
    viewCount: 934,
    likeCount: 156,
    topic: 'Next.js 14 New Features',
    thumbnail: '/nextjs.webp',
    theme: 'nextjs',
    category: 'frontend',
    ...overrides
  }),

  /**
   * MongoDB 포스트 데이터 생성
   */
  mongodb: (overrides?: Partial<PostInfo>): PostInfo => ({
    ...basePostData,
    id: 'mongodb-1',
    title: 'MongoDB 집계 파이프라인과 인덱싱 최적화',
    description: 'MongoDB의 강력한 집계 파이프라인을 활용한 복잡한 데이터 처리와 성능 최적화를 위한 인덱싱 전략을 알아봅니다.\n\n실제 프로덕션 환경에서의 성능 튜닝 경험을 공유합니다.',
    tags: ['MongoDB', 'Aggregation', 'Indexing', 'Performance'],
    viewCount: 523,
    likeCount: 67,
    topic: 'MongoDB Advanced',
    thumbnail: '/mongodb.webp',
    theme: 'mongodb',
    category: 'database',
    ...overrides
  }),

  /**
   * Docker 포스트 데이터 생성
   */
  docker: (overrides?: Partial<PostInfo>): PostInfo => ({
    ...basePostData,
    id: 'docker-1',
    title: 'Docker 멀티 스테이지 빌드와 이미지 최적화',
    description: 'Docker 멀티 스테이지 빌드를 활용한 이미지 크기 최적화와 보안 강화 방법을 알아봅니다.\n\n프로덕션 환경에서의 컨테이너 운영 모범 사례도 다룹니다.',
    tags: ['Docker', 'Multi-stage Build', 'Container', 'DevOps'],
    viewCount: 789,
    likeCount: 102,
    topic: 'Docker Optimization',
    thumbnail: '/docker.webp',
    theme: 'docker',
    category: 'devops',
    ...overrides
  }),

  /**
   * 커스텀 포스트 데이터 생성
   */
  custom: (data: Partial<PostInfo>): PostInfo => ({
    ...basePostData,
    ...data
  })
};

/**
 * 여러 포스트 데이터 배열 생성
 */
export const createPostList = (count: number = 5): PostInfo[] => {
  const generators = [
    createPostData.algorithm,
    createPostData.spring,
    createPostData.nextjs,
    createPostData.mongodb,
    createPostData.docker
  ];

  return Array.from({ length: count }, (_, index) => {
    const generator = generators[index % generators.length];
    return generator({ id: `post-${index + 1}` });
  });
}; 