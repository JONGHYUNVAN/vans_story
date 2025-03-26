'use client'

import { useState, useEffect } from 'react'
import { Editor } from '../../new/editor/Editor'
import { Viewer } from '../../viewer/Viewer'
import { PostHeader } from '../../new/PostHeader'
import { useRouter } from 'next/navigation'
import { API_URLS } from '@/api/constants/apiUrl'
import { THEMES, getCategoriesByTheme } from '@/constants/themes'
import { useTranslation } from '@/utils/i18n'
import AlgorithmPostCard from '../../view/common/postcard/algorithm/PostCard'
import NextjsPostCard from '../../view/common/postcard/nextjs/PostCard'
import NestjsPostCard from '../../view/common/postcard/nestjs/PostCard'
import MariadbPostCard from '../../view/common/postcard/mariadb/PostCard'
import MongodbPostCard from '../../view/common/postcard/mongodb/PostCard'
import SpringPostCard from '../../view/common/postcard/spring/PostCard'
import { tokenStorage } from '@/utils/token'
import AlgorithmLayout from '../../view/algorithm/AlgorithmLayout'
import { PostFormInputs } from '../../new/components/PostFormInputs'
import { useCategories } from '@/hooks/useCategories'
import NextjsLayout from '../../view/nextjs/NextjsLayout'
import NestjsLayout from '../../view/nestjs/NestjsLayout'
import MariadbLayout from '../../view/mariadb/MariadbLayout'
import MongodbLayout from '../../view/mongodb/MongodbLayout'
import SpringLayout from '../../view/spring/SpringLayout'
import { FrameworkPost } from '@/types/FrameworkPost'

type ViewMode = 'edit' | 'preview'

interface PostEditFormProps {
  postId: string
}

export function PostEditForm({ postId }: PostEditFormProps) {
  const router = useRouter()
  const { t } = useTranslation('')
  
  // 기본 상태 관리
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [theme, setTheme] = useState('nextjs')
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [thumbnail, setThumbnail] = useState('')
  const [language, setLanguage] = useState('ko')
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [isViewerMounted, setIsViewerMounted] = useState(false)

  // 카테고리 관리 훅 사용
  const { categories, selectedCategory, setSelectedCategory } = useCategories(theme, language)

  // 기존 포스트 데이터 로드
  useEffect(() => {
    const fetchPost = async () => {
      try {
        alert(postId)
        const response = await fetch(`${API_URLS.POST.UPDATE}/${postId}`)
        if (!response.ok) {
          throw new Error('게시글을 불러오는데 실패했습니다.')
        }
        
        const postData = await response.json()
        setTitle(postData.title || '')
        setContent(postData.content || '')
        setTheme(postData.theme || 'nextjs')
        setTopic(postData.topic || '')
        setDescription(postData.description || '')
        setTags(postData.tags || [])
        setSelectedCategory(postData.category || '')
        setThumbnail(postData.thumbnail || '')
        setLanguage(postData.language || 'ko')
      } catch (error) {
        console.error('Error fetching post:', error)
        alert('게시글을 불러오는데 실패했습니다.2')
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId, router, setSelectedCategory])

  useEffect(() => {
    if (viewMode === 'preview') {
      const timer = setTimeout(() => {
        setIsViewerMounted(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setIsViewerMounted(false)
    }
  }, [viewMode])

  // 게시글 수정 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !content || !theme || !topic || !description || !selectedCategory || !language) {
      alert(t('post.create.validation'))
      return
    }

    try {
      const token = tokenStorage.getToken()
      if (!token) {
        throw new Error('로그인이 필요합니다.')
      }

      const response = await fetch(`${API_URLS.POST.UPDATE}/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          theme,
          topic,
          description,
          tags,
          category: selectedCategory,
          thumbnail,
          language
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || t('post.edit.submitError'))
      }

      router.push(`/post/view/${theme}/${postId}`)
    } catch (error) {
      console.error('Error updating post:', error)
      alert(error instanceof Error ? error.message : t('post.edit.submitError'))
    }
  }

  // 임시저장 처리
  const handleTempSave = () => {
    if (title || content || theme || topic || description || tags.length > 0 || selectedCategory || thumbnail || language) {
      localStorage.setItem(`temp_post_${postId}`, JSON.stringify({
        title,
        content,
        theme,
        topic,
        description,
        tags,
        category: selectedCategory,
        thumbnail,
        language
      }))
      alert(t('post.create.tempSaveSuccess'))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111111] py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <form id="post-form" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333333] rounded-lg p-8">
            <PostHeader 
              postData={{
                title,
                content,
                theme,
                topic,
                description,
                tags,
                category: selectedCategory,
                thumbnail,
                language
              }}
              onSubmit={handleSubmit}
              onTempSave={handleTempSave}
            />
            
            <div className="mt-2 border dark:border-[#333333] rounded flex">
              <button
                type="button"
                className={`py-2 px-4 ${viewMode === 'edit' ? 'bg-gray-200 dark:bg-[#333333]' : ''}`}
                onClick={() => setViewMode('edit')}
              >
                {t('post.create.edit')}
              </button>
              <button
                type="button"
                className={`py-2 px-4 ${viewMode === 'preview' ? 'bg-gray-200 dark:bg-[#333333]' : ''}`}
                onClick={() => setViewMode('preview')}
              >
                {t('post.create.preview')}
              </button>
            </div>

            {viewMode === 'edit' ? (
              <div className="space-y-6">
                <PostFormInputs
                  title={title}
                  setTitle={setTitle}
                  topic={topic}
                  setTopic={setTopic}
                  description={description}
                  setDescription={setDescription}
                  theme={theme}
                  setTheme={setTheme}
                  language={language}
                  setLanguage={setLanguage}
                  category={selectedCategory}
                  setCategory={setSelectedCategory}
                  thumbnail={thumbnail}
                  setThumbnail={setThumbnail}
                  tags={tags}
                  setTags={setTags}
                  availableCategories={categories}
                />
                <Editor initialContent={content} onChange={setContent} />
              </div>
            ) : (
              <div className="mt-8">
                {theme === 'algorithm' && (
                  <AlgorithmPostCard
                    post={{
                      id: postId,
                      title,
                      description,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      tags,
                      viewCount: 0,
                      likeCount: 0,
                      topic,
                      author: '미리보기',
                      theme,
                      category: selectedCategory,
                      thumbnail,
                      language
                    } as FrameworkPost}
                  />
                )}
                {theme === 'nextjs' && (
                  <NextjsPostCard
                    post={{
                      id: postId,
                      title,
                      description,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      tags,
                      viewCount: 0,
                      likeCount: 0,
                      topic,
                      author: '미리보기',
                      theme,
                      category: selectedCategory,
                      thumbnail,
                      language
                    } as FrameworkPost}
                  />
                )}
                {theme === 'nestjs' && (
                  <NestjsPostCard
                    post={{
                      id: postId,
                      title,
                      description,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      tags,
                      viewCount: 0,
                      likeCount: 0,
                      topic,
                      author: '미리보기',
                      theme,
                      category: selectedCategory,
                      thumbnail,
                      language
                    } as FrameworkPost}
                  />
                )}
                {theme === 'mariadb' && (
                  <MariadbPostCard
                    post={{
                      id: postId,
                      title,
                      description,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      tags,
                      viewCount: 0,
                      likeCount: 0,
                      topic,
                      author: '미리보기',
                      theme,
                      category: selectedCategory,
                      thumbnail,
                      language
                    } as FrameworkPost}
                  />
                )}
                {theme === 'mongodb' && (
                  <MongodbPostCard
                    post={{
                      id: postId,
                      title,
                      description,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      tags,
                      viewCount: 0,
                      likeCount: 0,
                      topic,
                      author: '미리보기',
                      theme,
                      category: selectedCategory,
                      thumbnail,
                      language
                    } as FrameworkPost}
                  />
                )}
                {theme === 'spring' && (
                  <SpringPostCard
                    post={{
                      id: postId,
                      title,
                      description,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      tags,
                      viewCount: 0,
                      likeCount: 0,
                      topic,
                      author: '미리보기',
                      theme,
                      category: selectedCategory,
                      thumbnail,
                      language
                    } as FrameworkPost}
                  />
                )}

                {isViewerMounted && (
                  <div className="mt-8">
                    {theme === 'algorithm' && (
                      <AlgorithmLayout title={title} isPreview>
                        <div className="prose dark:prose-invert max-w-none">
                          <Viewer content={content} />
                        </div>
                      </AlgorithmLayout>
                    )}
                    {theme === 'nextjs' && (
                      <NextjsLayout title={title} isPreview>
                        <div className="prose dark:prose-invert max-w-none">
                          <Viewer content={content} />
                        </div>
                      </NextjsLayout>
                    )}
                    {theme === 'nestjs' && (
                      <NestjsLayout title={title} isPreview>
                        <div className="prose dark:prose-invert max-w-none">
                          <Viewer content={content} />
                        </div>
                      </NestjsLayout>
                    )}
                    {theme === 'mariadb' && (
                      <MariadbLayout title={title} isPreview>
                        <div className="prose dark:prose-invert max-w-none">
                          <Viewer content={content} />
                        </div>
                      </MariadbLayout>
                    )}
                    {theme === 'mongodb' && (
                      <MongodbLayout title={title} isPreview>
                        <div className="prose dark:prose-invert max-w-none">
                          <Viewer content={content} />
                        </div>
                      </MongodbLayout>
                    )}
                    {theme === 'spring' && (
                      <SpringLayout title={title}>
                        <div className="prose dark:prose-invert max-w-none">
                          <Viewer content={content} />
                        </div>
                      </SpringLayout>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
} 