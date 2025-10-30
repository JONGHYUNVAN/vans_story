/**
 * 통합 PostPreview 컴포넌트
 * 새로운 타입 시스템을 사용하며 다양한 미리보기 모드 지원
 */

import { PostInfo } from "@/interfaces/post/types"
import { PostPreviewProps, toPostInfo } from '@/types/post'
import { Viewer } from '../features/post/viewer/Viewer'

// PostCard 컴포넌트들 import
import AlgorithmPostCard from '../ui/post/postcard/algorithm/PostCard'
import NextjsPostCard from '../ui/post/postcard/nextjs/PostCard'
import NestjsPostCard from '../ui/post/postcard/nestjs/PostCard'
import MariadbPostCard from '../ui/post/postcard/mariadb/PostCard'
import MongodbPostCard from '../ui/post/postcard/mongodb/PostCard'
import SpringPostCard from '../ui/post/postcard/spring/PostCard'
import DatabaseTheoryPostCard from '../ui/post/postcard/database-theory/PostCard'
import DockerPostCard from '../ui/post/postcard/docker/PostCard'
import JWTPostCard from '../ui/post/postcard/jwt/PostCard'

// Layout 컴포넌트들 import
import AlgorithmLayout from '../../app/post/view/algorithm/AlgorithmLayout'
import NextjsLayout from '../../app/post/view/nextjs/NextjsLayout'
import NestjsLayout from '../../app/post/view/nestjs/NestjsLayout'
import MariadbLayout from '../../app/post/view/mariadb/MariadbLayout'
import MongodbLayout from '../../app/post/view/mongodb/MongodbLayout'
import SpringLayout from '../../app/post/view/spring/SpringLayout'
import DatabaseTheoryLayout from '../../app/post/view/database-theory/DatabaseTheoryLayout'
import DockerLayout from '../../app/post/view/docker/DockerLayout'
import JWTLayout from '../../app/post/view/jwt/JWTLayout'

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
} as const

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
} as const

type SupportedMainCategory = keyof typeof POST_CARD_COMPONENTS

export function PostPreview({
  post,
  isViewerMounted = true,
  showCard = true,
  showLayout = true
}: PostPreviewProps) {
  // post가 유효한 객체인지 확인
  if (!post || typeof post !== 'object') {
    return (
      <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
        <p className="text-red-800">유효하지 않은 포스트 데이터입니다.</p>
      </div>
    )
  }

  // 필수 데이터 검증
  if (!post.title || !post.content || !post.mainCategory) {
    return (
      <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-800">미리보기를 표시하기 위한 데이터가 부족합니다.</p>
        <ul className="text-yellow-700 text-sm mt-2">
          {!post.title && <li>• 제목이 필요합니다</li>}
          {!post.content && <li>• 내용이 필요합니다</li>}
          {!post.mainCategory && <li>• 메인 카테고리가 필요합니다</li>}
        </ul>
      </div>
    )
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
    createdAt: post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || new Date().toISOString(),
    tags: post.tags || [],
    viewCount: post.viewCount || 0,
    likeCount: post.likeCount || 0,
    mainCategory: post.mainCategory!,
    subCategory: post.subCategory || '',
    thumbnail: post.thumbnail || '',
    language: post.language || 'ko'
  }

  const mainCategory = post.mainCategory as SupportedMainCategory
  const PostCardComponent = POST_CARD_COMPONENTS[mainCategory]
  const LayoutComponent = LAYOUT_COMPONENTS[mainCategory]
  
  const hasComponents = mainCategory in POST_CARD_COMPONENTS && mainCategory in LAYOUT_COMPONENTS

  return (
    <div className="mt-4 space-y-8">
      {hasComponents ? (
        <>
          {showCard && <PostCardComponent post={postInfo} />}
          {showLayout && (
            <LayoutComponent title={post.title!} isPreview>
              <div className="prose max-w-none text-white">
                {isViewerMounted && <Viewer content={post.content!} />}
              </div>
            </LayoutComponent>
          )}
        </>
      ) : (
        // 지원하지 않는 카테고리의 경우 기본 레이아웃
        <div className="prose max-w-none text-white">
          <h1>{post.title}</h1>
          <div className="text-sm text-gray-400 mb-4">
            메인 카테고리: {post.mainCategory} | 하위 카테고리: {post.subCategory} | 주제: {post.topic}
          </div>
          {post.description && (
            <p className="text-gray-300 mb-4">{post.description}</p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {isViewerMounted && <Viewer content={post.content!} />}
        </div>
      )}
    </div>
  )
}
