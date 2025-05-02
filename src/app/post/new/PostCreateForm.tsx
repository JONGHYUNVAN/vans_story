'use client'

import { useState, useEffect } from 'react'
import { Editor } from './editor/Editor'
import { Viewer } from '../viewer/Viewer'
import { PostHeader } from './PostHeader'
import { useRouter } from 'next/navigation'
import { API_URLS } from '@/api/constants/apiUrl'
import { THEMES, getCategoriesByTheme } from '@/constants/themes'
import { useTranslation } from '@/utils/i18n'
import AlgorithmPostCard from '../view/common/postcard/algorithm/PostCard'
import NextjsPostCard from '../view/common/postcard/nextjs/PostCard'
import NestjsPostCard from '../view/common/postcard/nestjs/PostCard'
import MariadbPostCard from '../view/common/postcard/mariadb/PostCard'
import MongodbPostCard from '../view/common/postcard/mongodb/PostCard'
import SpringPostCard from '../view/common/postcard/spring/PostCard'
import { tokenStorage } from '@/utils/token'
import AlgorithmLayout from '../view/algorithm/AlgorithmLayout'
import { PostFormInputs } from './components/PostFormInputs'
import { useCategories } from '@/hooks/useCategories'
import NextjsLayout from '../view/nextjs/NextjsLayout'
import NestjsLayout from '../view/nestjs/NestjsLayout'
import MariadbLayout from '../view/mariadb/MariadbLayout'
import MongodbLayout from '../view/mongodb/MongodbLayout'
import SpringLayout from '../view/spring/SpringLayout'
import { SiNextdotjs } from 'react-icons/si'
import { FrameworkPost } from '@/types/FrameworkPost'
import { PostPreview } from '../common/PostPreview'

type ViewMode = 'edit' | 'preview'

// 언어 옵션 배열
const LANGUAGES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' }
]

export function PostCreateForm() {
  const router = useRouter()
  const { t } = useTranslation('')
  
  // 기본 상태 관리
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<any>('')
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

  // 임시저장 데이터 로드
  useEffect(() => {
    const savedPost = localStorage.getItem('temp_post')
    if (savedPost) {
      try {
        const postData = JSON.parse(savedPost)
        setTitle(postData.title || '')
        setContent(postData.content || '')
        setTheme(postData.theme || 'nextjs')
        setTopic(postData.topic || '')
        setDescription(postData.description || '')
        setTags(postData.tags || [])
        setThumbnail(postData.thumbnail || '')
        setLanguage(postData.language || 'ko')
        // 카테고리는 나중에 categories가 로드된 후 처리됨
      } catch (error) {
        console.error(t('post.create.tempSaveError'), error)
      }
    }
  }, [t])

  useEffect(() => {
    if (viewMode === 'preview') {
      // 약간의 지연을 주어 DOM이 준비된 후 Viewer를 마운트
      const timer = setTimeout(() => {
        setIsViewerMounted(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsViewerMounted(false);
    }
  }, [viewMode]);



  // 게시글 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const missingFields = []
    if (!title) missingFields.push('제목')
    if (!content) missingFields.push('내용')
    if (!theme) missingFields.push('테마')
    if (!topic) missingFields.push('주제')
    if (!description) missingFields.push('설명')
    if (!selectedCategory) missingFields.push('카테고리')
    if (!language) missingFields.push('언어')

    if (missingFields.length > 0) {
      alert(`다음 항목을 입력해주세요:\n${missingFields.join(', ')}`)
      return
    }

    try {
      const token = tokenStorage.getToken()
      if (!token) {
        throw new Error('로그인이 필요합니다.')
      }

      const response = await fetch(API_URLS.POST.CREATE, {
        method: 'POST',
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
          category: selectedCategory?.value || '',
          thumbnail,
          language
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || t('post.create.submitError'))
      }

      if (!data?._id) {
        throw new Error('게시글 ID를 받지 못했습니다.')
      }

      localStorage.removeItem('temp_post')
      router.push(`/post/view/${theme}/${data._id}`)
    } catch (error) {
      console.error('Error submitting post:', error)
      alert(error instanceof Error ? error.message : t('post.create.submitError'))
    }
  }

  // 임시저장 처리
  const handleTempSave = () => {
    if (title || content || theme || topic || description || tags.length > 0 || selectedCategory || thumbnail || language) {
      localStorage.setItem('temp_post', JSON.stringify({
        title,
        content,
        theme,
        topic,
        description,
        tags,
        category: selectedCategory?.value || '',
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
                category: selectedCategory?.value || '',
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
                <Editor
                  initialContent={content}
                  onChange={setContent}
                />
              </div>
            ) : (
              <PostPreview
                id="preview"
                title={title}
                content={content}
                theme={theme}
                topic={topic}
                description={description}
                tags={tags}
                category={selectedCategory?.value || ''}
                thumbnail={thumbnail}
                language={language}
                isViewerMounted={isViewerMounted}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  )
}