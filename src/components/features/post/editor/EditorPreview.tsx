import { PostInfo } from "@/interfaces/post/types"
import { Viewer } from '../viewer/Viewer'
import AlgorithmPostCard from '../../../ui/post/postcard/algorithm/PostCard'
import NextjsPostCard from '../../../ui/post/postcard/nextjs/PostCard'
import NestjsPostCard from '../../../ui/post/postcard/nestjs/PostCard'
import MariadbPostCard from '../../../ui/post/postcard/mariadb/PostCard'
import MongodbPostCard from '../../../ui/post/postcard/mongodb/PostCard'
import SpringPostCard from '../../../ui/post/postcard/spring/PostCard'
import DatabaseTheoryPostCard from '../../../ui/post/postcard/database-theory/PostCard'
import AlgorithmLayout from '../../../../app/post/view/algorithm/AlgorithmLayout'
import NextjsLayout from '../../../../app/post/view/nextjs/NextjsLayout'
import NestjsLayout from '../../../../app/post/view/nestjs/NestjsLayout'
import MariadbLayout from '../../../../app/post/view/mariadb/MariadbLayout'
import MongodbLayout from '../../../../app/post/view/mongodb/MongodbLayout'
import SpringLayout from '../../../../app/post/view/spring/SpringLayout'
import DatabaseTheoryLayout from '../../../../app/post/view/database-theory/DatabaseTheoryLayout'

interface PostPreviewProps {
  id: string
  title: string
  content: string
  theme: string
  topic: string
  description: string
  tags: string[]
  category: string
  thumbnail: string
  language: string
  isViewerMounted?: boolean
}

export function PostPreview({
  id,
  title,
  content,
  theme,
  topic,
  description,
  tags,
  category,
  thumbnail,
  language,
  isViewerMounted = true
}: PostPreviewProps) {
  const postData: PostInfo = {
    id,
    title,
    description,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags,
    viewCount: 0,
    likeCount: 0,
    topic,
    author: '미리보기',
    mainCategory: theme,
    subCategory: category,
    thumbnail,
    language
  }

  return (
    <div className="mt-4 space-y-8">
      {theme === 'algorithm' && (
        <>
          <AlgorithmPostCard post={postData} />
          <AlgorithmLayout title={title} isPreview>
            <div className="prose max-w-none text-white">
              {isViewerMounted && <Viewer content={content} />}
            </div>
          </AlgorithmLayout>
        </>
      )}
      {theme === 'database-theory' && (
        <>
          <DatabaseTheoryPostCard post={postData} />
          <DatabaseTheoryLayout title={title} isPreview>
            <div className="prose max-w-none text-white">
              {isViewerMounted && <Viewer content={content} />}
            </div>
          </DatabaseTheoryLayout>
        </>
      )}
      {theme === 'nextjs' && (
        <>
          <NextjsPostCard post={postData} />
          <NextjsLayout title={title} isPreview>
            <div className="prose max-w-none text-white">
              {isViewerMounted && <Viewer content={content} />}
            </div>
          </NextjsLayout>
        </>
      )}
      {theme === 'nestjs' && (
        <>
          <NestjsPostCard post={postData} />
          <NestjsLayout title={title} isPreview>
            <div className="prose max-w-none text-white">
              {isViewerMounted && <Viewer content={content} />}
            </div>
          </NestjsLayout>
        </>
      )}
      {theme === 'mariadb' && (
        <>
          <MariadbPostCard post={postData} />
          <MariadbLayout title={title} isPreview>
            <div className="prose max-w-none text-white">
              {isViewerMounted && <Viewer content={content} />}
            </div>
          </MariadbLayout>
        </>
      )}
      {theme === 'mongodb' && (
        <>
          <MongodbPostCard post={postData} />
          <MongodbLayout title={title} isPreview>
            <div className="prose max-w-none text-white">
              {isViewerMounted && <Viewer content={content} />}
            </div>
          </MongodbLayout>
        </>
      )}
      {theme === 'spring' && (
        <>
          <SpringPostCard post={postData} />
          <SpringLayout title={title} isPreview>
            <div className="prose max-w-none text-white">
              {isViewerMounted && <Viewer content={content} />}
            </div>
          </SpringLayout>
        </>
      )}
      {!['algorithm', 'nextjs', 'nestjs', 'mariadb', 'mongodb', 'spring', 'database-theory'].includes(theme) && (
        <div className="prose max-w-none text-white">
          <h1>{title}</h1>
          {isViewerMounted && <Viewer content={content} />}
        </div>
      )}
    </div>
  )
} 