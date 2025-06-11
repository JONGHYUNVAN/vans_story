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

export type Post = {
  id: string
  title: string
  content: string
  theme: string
  topic: string
  description: string
  tags: string[]
  categoryId: string
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
  const { t } = useTranslation('post')
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const { categories } = useCategories(post?.theme || 'spring', post?.language || 'ko')

  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${tokenStorage.getToken()}`,
        },
      })
      if (!res.ok) throw new Error(res.status.toString())
      const data = await res.json()
      setPost(data)
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? t(`post.fetchError.${error.message}`)
        : t('post.fetchError.default')
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [postId, t])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

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
      title: post?.title || '',
      content: post?.content || '',
      theme: post?.theme || 'spring',
      topic: post?.topic || '',
      description: post?.description || '',
      tags: post?.tags || [],
      category: post?.categoryId || '',
      thumbnail: post?.thumbnail || '',
      language: post?.language || 'ko'
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
  }, [post, t, router])

  const handleTempSave = useCallback(() => {
    const postData: PostData = {
      title: post?.title || '',
      content: post?.content || '',
      theme: post?.theme || 'spring',
      topic: post?.topic || '',
      description: post?.description || '',
      tags: post?.tags || [],
      category: post?.categoryId || '',
      thumbnail: post?.thumbnail || '',
      language: post?.language || 'ko'
    }

    if (postData.title || postData.content || postData.theme || postData.topic || 
        postData.description || postData.tags.length > 0 || postData.category || 
        postData.thumbnail || postData.language) {
      localStorage.setItem(`temp_post_${postId}`, JSON.stringify(postData))
      alert(t('post.create.tempSaveSuccess'))
    }
  }, [post, t])

  const updatePost = useCallback(async (postData: Partial<Post>) => {
    try {
      setIsSubmitting(true)
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenStorage.getToken()}`,
        },
        body: JSON.stringify(postData),
      })
      if (!res.ok) throw new Error(res.status.toString())
      const updated = await res.json()
      setPost(updated)
      return updated
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? t(`post.updateError.${error.message}`)
        : t('post.updateError.default')
      setError(errorMessage)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [postId, t])

  return {
    // 상태
    post,
    setPost,
    isLoading,
    error,
    viewMode,
    setViewMode,
    
    // 카테고리 관련
    categories,
    
    // 핸들러
    handleSubmit,
    handleTempSave,
    
    // 현재 포스트 데이터
    currentPostData: {
      title: post?.title || '',
      content: post?.content || '',
      theme: post?.theme || 'spring',
      topic: post?.topic || '',
      description: post?.description || '',
      tags: post?.tags || [],
      category: post?.categoryId || '',
      thumbnail: post?.thumbnail || '',
      language: post?.language || 'ko'
    }
  }
} 