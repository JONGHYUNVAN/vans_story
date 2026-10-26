import { PostInfo } from '@/types/post';
import { Viewer } from '@/components/features/post/viewer/Viewer';
import AlgorithmPostCard from '@/components/features/post/postcard/algorithm/PostCard';
import NextjsPostCard from '@/components/features/post/postcard/nextjs/PostCard';
import NestjsPostCard from '@/components/features/post/postcard/nestjs/PostCard';
import MariadbPostCard from '@/components/features/post/postcard/mariadb/PostCard';
import MongodbPostCard from '@/components/features/post/postcard/mongodb/PostCard';
import SpringPostCard from '@/components/features/post/postcard/spring/PostCard';
import DatabaseTheoryPostCard from '@/components/features/post/postcard/database-theory/PostCard';
import AlgorithmLayout from '@/app/post/view/algorithm/_components/AlgorithmLayout';
import NextjsLayout from '@/app/post/view/nextjs/_components/NextjsLayout';
import NestjsLayout from '@/app/post/view/nestjs/_components/NestjsLayout';
import MariadbLayout from '@/app/post/view/mariadb/_components/MariadbLayout';
import MongodbLayout from '@/app/post/view/mongodb/_components/MongodbLayout';
import SpringLayout from '@/app/post/view/spring/_components/SpringLayout';
import DatabaseTheoryLayout from '@/app/post/view/database-theory/_components/DatabaseTheoryLayout';

interface PostPreviewProps {
  id: string;
  title: string;
  content: string;
  theme: string;
  topic: string;
  description: string;
  tags: string[];
  category: string;
  thumbnail: string;
  language: string;
  isViewerMounted?: boolean;
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
  isViewerMounted = true,
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
    authorEmail: '',
    mainCategory: theme,
    subCategory: category,
    thumbnail,
    language,
  };

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
      {![
        'algorithm',
        'nextjs',
        'nestjs',
        'mariadb',
        'mongodb',
        'spring',
        'database-theory',
      ].includes(theme) && (
        <div className="prose max-w-none text-white">
          <h1>{title}</h1>
          {isViewerMounted && <Viewer content={content} />}
        </div>
      )}
    </div>
  );
}
