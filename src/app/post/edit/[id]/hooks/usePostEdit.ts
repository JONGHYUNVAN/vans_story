import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { API_URLS } from '@/constants/apiUrl'
import { useTranslation } from '@/utils/i18n'
import { tokenStorage } from '@/utils/token'
import { useCategories } from '@/hooks/useCategories'
import { ApiWrapper } from '@/utils/apiWrapper'

export type ViewMode = 'edit' | 'preview'

export interface PostData {
  title: string
  content: string
  theme: string
  topic: string
  description: string
  tags: string[]
  category: string
  thumbnail: string
  language: string
}

async function fetchPostData(postId: string) {
  const response = await fetch(`${API_URLS.POST.UPDATE}/${postId}`, {
    next: {
      revalidate: 0 // 항상 최신 데이터를 가져오도록 설정
    }
  })
  
  if (!response.ok) {
    throw new Error('게시글을 불러오는데 실패했습니다.')
  }
  
  return response.json()
}

export function usePostEdit(postId: string) {
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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 카테고리 관리 훅 사용
  const { categories, selectedCategory, setSelectedCategory } = useCategories(theme, language)

  // 포스트 데이터 로드
  const loadPostData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchPostData(postId)
      
      setTitle(data.title || '')
      setContent(data.content || '')
      setTheme(data.theme || 'spring')
      setTopic(data.topic || '')
      setDescription(data.description || '')
      setTags(data.tags || [])
      setThumbnail(data.thumbnail || '')
      setLanguage(data.language || 'ko')

      // 카테고리 설정
      if (data && categories.length > 0) {
        const matchedCategory = categories.find(cat => cat.value === data.category)
        setSelectedCategory(matchedCategory || categories[0])
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      setError(error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [postId, categories, setSelectedCategory])

  useEffect(() => {
    if (postId) {
      loadPostData()
    }
  }, [postId, loadPostData])

  // viewMode 변경 이벤트 구독
  useEffect(() => {
    const handleViewModeChange = (event: CustomEvent<{ mode: ViewMode }>) => {
      setViewMode(event.detail.mode)
    }

    window.addEventListener('viewModeChange', handleViewModeChange as EventListener)
    return () => {
      window.removeEventListener('viewModeChange', handleViewModeChange as EventListener)
    }
  }, [])

  // URL의 mode 파라미터로 초기 viewMode 설정
  useEffect(() => {
    const url = new URL(window.location.href)
    const mode = url.searchParams.get('mode') as ViewMode
    if (mode === 'edit' || mode === 'preview') {
      setViewMode(mode)
    }
  }, [])

  const handleSubmit = useCallback(async () => {
    const postData: PostData = {
      title,
      content,
      theme,
      topic,
      description,
      tags,
      category: selectedCategory?.value || '',
      thumbnail,
      language
    }

    if (!postData.title || !postData.content || !postData.theme || !postData.topic || 
        !postData.description || !postData.category || !postData.language) {
      setError(t('post.create.validation'))
      return
    }

    try {
      const token = tokenStorage.getToken()
      if (!token) {
        throw new Error('로그인이 필요합니다.')
      }

      const response = await ApiWrapper.patch(`${API_URLS.POST.UPDATE}/${postId}`, postData)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data?.message || t('post.edit.submitError'))
      }

      router.push(`/post/view/${postData.theme}/${postId}`)
    } catch (error) {
      console.error('Error updating post:', error)
      setError(error instanceof Error ? error.message : t('post.edit.submitError'))
    }
  }, [title, content, theme, topic, description, tags, selectedCategory, thumbnail, language, postId, t, router])

  const handleTempSave = useCallback(() => {
    const postData: PostData = {
      title,
      content,
      theme,
      topic,
      description,
      tags,
      category: selectedCategory?.value || '',
      thumbnail,
      language
    }

    if (postData.title || postData.content || postData.theme || postData.topic || 
        postData.description || postData.tags.length > 0 || postData.category || 
        postData.thumbnail || postData.language) {
      localStorage.setItem(`temp_post_${postId}`, JSON.stringify(postData))
      alert(t('post.create.tempSaveSuccess'))
    }
  }, [title, content, theme, topic, description, tags, selectedCategory, thumbnail, language, postId, t])

  return {
    // 상태
    title,
    setTitle,
    content,
    setContent,
    theme,
    setTheme,
    topic,
    setTopic,
    description,
    setDescription,
    tags,
    setTags,
    thumbnail,
    setThumbnail,
    language,
    setLanguage,
    viewMode,
    isLoading,
    error,
    
    // 카테고리 관련
    categories,
    selectedCategory,
    setSelectedCategory,
    
    // 핸들러
    handleSubmit,
    handleTempSave,
    
    // 현재 포스트 데이터
    currentPostData: {
      title,
      content,
      theme,
      topic,
      description,
      tags,
      category: selectedCategory?.value || '',
      thumbnail,
      language
    }
  }
} 