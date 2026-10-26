/**
 * 통합 PostPreview 컴포넌트
 * 새로운 타입 시스템을 사용하며 다양한 미리보기 모드 지원
 */

import React from 'react';
import type { PostInfo, PostPreviewProps } from '@/types/post';

import { Viewer } from '@/components/features/post/viewer/Viewer';

// PostCard 컴포넌트들 import
import AlgorithmPostCard from '@/components/features/post/postcard/algorithm/PostCard';
import NextjsPostCard from '@/components/features/post/postcard/nextjs/PostCard';
import NestjsPostCard from '@/components/features/post/postcard/nestjs/PostCard';
import MariadbPostCard from '@/components/features/post/postcard/mariadb/PostCard';
import MongodbPostCard from '@/components/features/post/postcard/mongodb/PostCard';
import SpringPostCard from '@/components/features/post/postcard/spring/PostCard';
import DatabaseTheoryPostCard from '@/components/features/post/postcard/database-theory/PostCard';
import DockerPostCard from '@/components/features/post/postcard/docker/PostCard';
import JWTPostCard from '@/components/features/post/postcard/jwt/PostCard';

// Layout 컴포넌트들 import
import AlgorithmLayout from '@/app/post/view/algorithm/_components/AlgorithmLayout';
import NextjsLayout from '@/app/post/view/nextjs/_components/NextjsLayout';
import NestjsLayout from '@/app/post/view/nestjs/_components/NestjsLayout';
import MariadbLayout from '@/app/post/view/mariadb/_components/MariadbLayout';
import MongodbLayout from '@/app/post/view/mongodb/_components/MongodbLayout';
import SpringLayout from '@/app/post/view/spring/_components/SpringLayout';
import DatabaseTheoryLayout from '@/app/post/view/database-theory/_components/DatabaseTheoryLayout';
import DockerLayout from '@/app/post/view/docker/_components/DockerLayout';
import JWTLayout from '@/app/post/view/jwt/_components/JWTLayout';

// 카테고리별 컴포넌트 매핑
const POST_CARD_COMPONENTS = {
  algorithm: AlgorithmPostCard,
  'database-theory': DatabaseTheoryPostCard,
  nextjs: NextjsPostCard,
  nestjs: NestjsPostCard,
  mariadb: MariadbPostCard,
  mongodb: MongodbPostCard,
  spring: SpringPostCard,
  docker: DockerPostCard,
  jwt: JWTPostCard,
} as const;

const LAYOUT_COMPONENTS = {
  algorithm: AlgorithmLayout,
  'database-theory': DatabaseTheoryLayout,
  nextjs: NextjsLayout,
  nestjs: NestjsLayout,
  mariadb: MariadbLayout,
  mongodb: MongodbLayout,
  spring: SpringLayout,
  docker: DockerLayout,
  jwt: JWTLayout,
} as const;

type SupportedMainCategory = keyof typeof POST_CARD_COMPONENTS;

// memo 제거: 실시간 미리보기에서는 즉시 반영이 더 중요
export function PostPreview({
  post,
  isViewerMounted = true,
  showCard = true,
  showLayout = true,
}: PostPreviewProps) {
  // post가 유효한 객체인지 확인
  if (!post || typeof post !== 'object') {
    return (
      <div className="mt-4 rounded border border-red-400 bg-red-100 p-4">
        <p className="text-red-800">유효하지 않은 포스트 데이터입니다.</p>
      </div>
    );
  }

  // 필수 데이터 검증
  if (!post.title || !post.content || !post.mainCategory) {
    return (
      <div className="mt-4 rounded border border-yellow-400 bg-yellow-100 p-4">
        <p className="text-yellow-800">미리보기를 표시하기 위한 데이터가 부족합니다.</p>
        <ul className="mt-2 text-sm text-yellow-700">
          {!post.title && <li>• 제목이 필요합니다</li>}
          {!post.content && <li>• 내용이 필요합니다</li>}
          {!post.mainCategory && <li>• 메인 카테고리가 필요합니다</li>}
        </ul>
      </div>
    );
  }

  // ✅ content는 원본 그대로 사용 (객체 또는 문자열)
  // PostInfo로 변환 (기존 컴포넌트들과 호환성을 위해)
  const postInfo: PostInfo = {
    id: post.id || 'preview',
    title: post.title!,
    topic: post.topic || '',
    description: post.description || '',
    content: post.content!, // ✅ 객체든 문자열이든 그대로 전달
    author: post.author || '미리보기',
    authorEmail: post.authorEmail || '',
    createdAt: post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || new Date().toISOString(),
    tags: post.tags || [],
    viewCount: post.viewCount || 0,
    likeCount: post.likeCount || 0,
    mainCategory: post.mainCategory!,
    subCategory: post.subCategory || '',
    thumbnail: post.thumbnail || '',
    language: post.language || 'ko',
  };

  const mainCategory = post.mainCategory as SupportedMainCategory;
  const PostCardComponent = POST_CARD_COMPONENTS[mainCategory];
  const LayoutComponent = LAYOUT_COMPONENTS[mainCategory];

  const hasComponents = mainCategory in POST_CARD_COMPONENTS && mainCategory in LAYOUT_COMPONENTS;

  return (
    <div className="mt-4 space-y-8">
      {hasComponents ? (
        <>
          {showCard && <PostCardComponent post={postInfo} />}
          {showLayout && (
            <LayoutComponent title={post.title!} isPreview>
              <div className="prose max-w-none text-white [&_*]:!text-white [&_a]:!text-blue-300 [&_code]:!text-green-300 [&_em]:!text-white [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_h5]:!text-white [&_h6]:!text-white [&_li]:!text-white [&_strong]:!text-white [&_td]:!text-white [&_th]:!bg-gray-700 [&_th]:!text-white">
                {isViewerMounted && <Viewer content={post.content!} />}
              </div>
            </LayoutComponent>
          )}
        </>
      ) : (
        // 지원하지 않는 카테고리의 경우 기본 레이아웃
        <div className="prose max-w-none text-white">
          <h1>{post.title}</h1>
          <div className="mb-4 text-sm text-gray-400">
            메인 카테고리: {post.mainCategory} | 하위 카테고리: {post.subCategory} | 주제:{' '}
            {post.topic}
          </div>
          {post.description && <p className="mb-4 text-gray-300">{post.description}</p>}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="rounded bg-blue-600 px-2 py-1 text-sm text-white">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {isViewerMounted && <Viewer content={post.content!} />}
        </div>
      )}
    </div>
  );
}
