'use client'

import { useState, useEffect } from 'react'
import { Editor } from './editor/Editor'
import { Viewer } from '../viewer/Viewer'
import { PostHeader } from './PostHeader'
import { useRouter } from 'next/navigation'
import { API_URLS } from '@/api/constants/apiUrl'
import { THEMES, getCategoriesByTheme } from '@/constants/themes'
import { useTranslation } from '@/utils/i18n'
import PostCard from '../view/common/postcard/new/PostCard'
import { tokenStorage } from '@/utils/token'
import AlgorithmLayout from '../view/algorithm/AlgorithmLayout'
import { PostFormInputs } from './components/PostFormInputs'
import { useCategories } from '@/hooks/useCategories'

type ViewMode = 'edit' | 'preview'

// 언어 옵션 배열
const LANGUAGES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' }
]

interface Category {
  value: string;
  label: string;
  description?: string;
}

export function PostCreateForm() {
  const router = useRouter()
  const { t } = useTranslation('')
  
  // 기본 상태 관리
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [theme, setTheme] = useState('algorithm')
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [thumbnail, setThumbnail] = useState('')
  const [language, setLanguage] = useState('ko')
  const [viewMode, setViewMode] = useState<ViewMode>('edit')

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
        setTheme(postData.theme || 'algorithm')
        setTopic(postData.topic || '')
        setDescription(postData.description || '')
        setTags(postData.tags || [])
        setSelectedCategory(postData.category || '')
        setThumbnail(postData.thumbnail || '')
        setLanguage(postData.language || 'ko')
      } catch (error) {
        console.error(t('post.create.tempSaveError'), error)
      }
    }
  }, [t])

  // 게시글 제출 처리
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
          category: selectedCategory,
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
        category: selectedCategory,
        thumbnail,
        language
      }))
      alert(t('post.create.tempSaveSuccess'))
    }
  }

  return (
    <>
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
      
      <div className="mt-2 border rounded flex">
        <button
          type="button"
          className={`py-2 px-4 ${viewMode === 'edit' ? 'bg-gray-200' : ''}`}
          onClick={() => setViewMode('edit')}
        >
          {t('post.create.edit')}
        </button>
        <button
          type="button"
          className={`py-2 px-4 ${viewMode === 'preview' ? 'bg-gray-200' : ''}`}
          onClick={() => setViewMode('preview')}
        >
          {t('post.create.preview')}
        </button>
      </div>

      {viewMode === 'edit' ? (
        <form id="post-form" onSubmit={handleSubmit} className="space-y-4">
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
        </form>
      ) : (
        <div className="mt-2 flex flex-col gap-4">
          <PostCard 
            post={{
              id: 'preview',
              title: title || t('post.create.inputTitle'),
              description: description || t('post.create.inputDescription'),
              createdAt: new Date().toISOString(),
              tags: tags,
              viewCount: 0,
              likeCount: 0,
              topic: topic || t('post.create.inputTopic'),
              thumbnail: thumbnail,
              theme: theme
            }}
          />
          {theme === 'algorithm' ? (
            <div className="w-full">
              <AlgorithmLayout 
                title={title || t('post.create.inputTitle')}
                isPreview={true}
              >
                <div className="prose prose-gray max-w-none">
                  <Viewer content={content} />
                </div>
              </AlgorithmLayout>
            </div>
          ) : (
            <div className="mt-4 p-2 border rounded">
              <Viewer content={content} />
            </div>
          )}
        </div>
      )}
    </>
  )
}