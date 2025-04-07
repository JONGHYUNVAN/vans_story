'use client'

import { useState, useEffect } from 'react'
import { Editor } from '../../new/editor/Editor'
import { PostHeader } from '../../new/PostHeader'
import { useRouter } from 'next/navigation'
import { API_URLS } from '@/api/constants/apiUrl'
import { useTranslation } from '@/utils/i18n'
import { tokenStorage } from '@/utils/token'
import { PostFormInputs } from '../../new/components/PostFormInputs'
import { useCategories } from '@/hooks/useCategories'

import { PostPreview } from '../../common/PostPreview'

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
  const [theme, setTheme] = useState('spring')
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [thumbnail, setThumbnail] = useState('')
  const [language, setLanguage] = useState('ko')
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [isViewerMounted, setIsViewerMounted] = useState(false)

  // 카테고리 관리 훅 사용
  const { categories, selectedCategory, setSelectedCategory } = useCategories(theme, language)

  // 포스트 데이터
  const [postData, setPostData] = useState<any>(null)

  // 기존 포스트 데이터 로드
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URLS.POST.UPDATE}/${postId}`)
        if (!response.ok) {
          throw new Error('게시글을 불러오는데 실패했습니다.')
        }
        
        const data = await response.json()
        setPostData(data)
        setTitle(data.title || '')
        setContent(data.content || '')
        setTheme(data.theme || 'spring')
        setTopic(data.topic || '')
        setDescription(data.description || '')
        setTags(data.tags || [])
        setThumbnail(data.thumbnail || '')
        setLanguage(data.language || 'ko')
      } catch (error) {
        console.error('Error fetching post:', error)
        alert('게시글을 불러오는데 실패했습니다.')
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId, router])

  // 카테고리 설정
  useEffect(() => {
    if (postData && categories.length > 0) {
      // 서버에서 가져온 카테고리 값과 일치하는 카테고리 찾기
      const matchedCategory = categories.find(cat => cat.value === postData.category)
      setSelectedCategory(matchedCategory || categories[0])
    }
  }, [categories, postData, setSelectedCategory])

  // viewMode 변경 시에만 isViewerMounted 상태 관리
  useEffect(() => {
    if (viewMode === 'preview') {
      const timer = setTimeout(() => {
        setIsViewerMounted(true)
      }, 100)
      return () => {
        clearTimeout(timer)
        setIsViewerMounted(false)
      }
    } else {
      setIsViewerMounted(false)
    }
  }, [viewMode])

  // 테마 변경 시 isViewerMounted 상태 초기화
  useEffect(() => {
    if (viewMode === 'preview') {
      setIsViewerMounted(false)
      const timer = setTimeout(() => {
        setIsViewerMounted(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [theme])

  // 게시글 수정 처리
  const handleSubmit = async () => {
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
          category: selectedCategory?.value || '',
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
        category: selectedCategory?.value || '',
        thumbnail,
        language
      }))
      alert(t('post.create.tempSaveSuccess'))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
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
          <div className="bg-black -mx-8 -mb-8 mt-4 p-8">
            <PostPreview
              id={postId}
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
          </div>
        )}
      </div>
    </div>
  )
} 