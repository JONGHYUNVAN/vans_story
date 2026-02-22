/**
 * 통합 Post 관리 훅
 * 생성과 편집을 모두 처리하는 통합 훅
 */

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/utils/i18n'
import { 
  PostCreateData, 
  PostEditData, 
  BasePost,
  ViewMode 
} from '@/types/post'
import { useSubCategories } from '@/hooks/useSubCategories'
import { useImageUploadAndReplace } from '@/hooks/useImageUploadAndReplace'
import { API_URLS } from '@/constants/apiUrl'
import { tokenStorage } from '@/utils/token'
import { ApiFetch } from '@/lib/apiFetch'
import { getPostForEdit, saveTempPost, updatePost, loadTempPost } from '@/lib/posts/client-actions'

export interface UsePostOptions {
  mode: 'create' | 'edit'
  postId?: string
  initialData?: Partial<PostEditData>
  autoSave?: boolean
  enableValidation?: boolean
  onSuccess?: (data: any) => void | Promise<void>
  onError?: (error: Error) => void
  redirectPath?: string | null  // null이면 리다이렉트 안함
}

export interface UsePostReturn {
  // 폼 데이터
  formData: Partial<BasePost>
  updateFormData: (field: keyof BasePost, value: any) => void
  setFormData: (data: Partial<BasePost>) => void
  
  // 하위 카테고리
  subCategories: any[]
  selectedSubCategory: any
  setSelectedSubCategory: (subCategory: any) => void
  
  // 뷰 모드
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  
  // 상태
  isLoading: boolean
  isSaving: boolean
  hasUnsavedChanges: boolean
  errors: Record<string, string>
  
  // 이미지 및 에디터 Ref
  localImages: Map<string, File>
  setLocalImages: React.Dispatch<React.SetStateAction<Map<string, File>>>
  editorRef: React.MutableRefObject<any>
  
  // 액션
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleTempSave: () => void
  validateForm: () => boolean
  resetForm: () => void
}

export function usePost({
  mode,
  postId,
  initialData,
  autoSave = true,
  enableValidation = true,
  onSuccess,
  onError,
  redirectPath = undefined
}: UsePostOptions): UsePostReturn {
  const router = useRouter()
  const { t } = useTranslation('')
  
  // 기본 상태들
  const [formData, setFormData] = useState<Partial<BasePost>>({
    title: '',
    content: '',
    mainCategory: 'nextjs',
    subCategory: '',
    topic: '',
    description: '',
    tags: [],
    thumbnail: '',
    language: 'ko',
    ...initialData
  })
  
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [localImages, setLocalImages] = useState<Map<string, File>>(new Map())
  
  const originalDataRef = useRef<Partial<BasePost> | null>(null)
  const editorRef = useRef<any>(null)
  
  // 하위 카테고리 훅
  const {
    subCategories,
    selectedSubCategory,
    setSelectedSubCategory
  } = useSubCategories(formData.mainCategory || '', formData.language || 'ko')
  
  // 이미지 업로드 훅
  const { uploadAndReplace } = useImageUploadAndReplace(localImages)
  
  // 편집 모드일 때 데이터 로드
  useEffect(() => {
    if (mode === 'edit' && postId) {
      loadPostData()
    } else if (mode === 'create') {
      loadTempData()
    }
  }, [mode, postId])
  
  // 자동 저장
  useEffect(() => {
    if (autoSave && hasUnsavedChanges && !isSaving) {
      const timer = setTimeout(() => {
        handleTempSave()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [formData, hasUnsavedChanges, autoSave, isSaving])
  
  // 포스트 데이터 로드 (편집 모드)
  const loadPostData = async () => {
    if (!postId) return
    
    setIsLoading(true)
    try {
      const post = await getPostForEdit(postId)
      const convertedData = {
        ...post,
        id: post.id || '',
        mainCategory: post.mainCategory,
        subCategory: post.subCategory
      } as PostEditData
      
      setFormData(convertedData)
      originalDataRef.current = convertedData
      
      // 하위 카테고리 설정
      if (convertedData.subCategory) {
        const subCategory = subCategories.find(cat => cat.value === convertedData.subCategory)
        if (subCategory) {
          setSelectedSubCategory(subCategory)
        }
      }
      
    } catch (error) {
      console.error('포스트 로드 실패:', error)
      setErrors({ load: '포스트를 불러오는데 실패했습니다.' })
    } finally {
      setIsLoading(false)
    }
  }
  
  // 임시저장 데이터 로드 (생성 모드)
  const loadTempData = () => {
    const savedPost = localStorage.getItem('temp_post')
    if (savedPost) {
      try {
        const postData = JSON.parse(savedPost)
        const convertedData = postData as PostCreateData
        setFormData(prev => ({
          ...prev,
          ...convertedData
        }))
        setHasUnsavedChanges(true)
      } catch (error) {
        console.error('임시저장 데이터 로드 실패:', error)
      }
    }
  }
  
  // 폼 데이터 업데이트
  const updateFormData = (field: keyof BasePost, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setHasUnsavedChanges(true)
    
    // 메인 카테고리 변경시 하위 카테고리는 useSubCategories에서 자동으로 첫 번째로 설정됨
  }
  
  // 선택된 하위 카테고리가 변경되면 formData에 반영
  useEffect(() => {
    if (selectedSubCategory) {
      setFormData(prev => ({
        ...prev,
        subCategory: selectedSubCategory.value
      }))
    }
  }, [selectedSubCategory])
  
  // 폼 검증
  const validateForm = (): boolean => {
    if (!enableValidation) return true
    
    const newErrors: Record<string, string> = {}
    
    if (!formData.title?.trim()) {
      newErrors.title = '제목을 입력해주세요'
    }
    
    if (!formData.content) {
      newErrors.content = '내용을 입력해주세요'
    }
    
    if (!formData.mainCategory) {
      newErrors.mainCategory = '메인 카테고리를 선택해주세요'
    }
    
    if (!formData.subCategory) {
      newErrors.subCategory = '하위 카테고리를 선택해주세요'
    }
    
    if (!formData.topic?.trim()) {
      newErrors.topic = '주제를 입력해주세요'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // 임시저장
  const handleTempSave = async () => {
    try {
      if (mode === 'create') {
        localStorage.setItem('temp_post', JSON.stringify(formData))
      } else if (mode === 'edit' && postId) {
        await saveTempPost(postId, formData as PostEditData)
      }
      
      setHasUnsavedChanges(false)
      console.log('💾 임시저장 완료')
    } catch (error) {
      console.error('임시저장 실패:', error)
    }
  }
  
  // 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSaving(true)
    
    try {
      // 이미지 업로드 및 치환
      let finalContent = formData.content
      if (editorRef.current && localImages.size > 0) {
        finalContent = await uploadAndReplace(finalContent)
      }
      
      // API 호출용 데이터 준비 (백엔드 DTO에 맞게 필터링)
      const submitData = {
        title: formData.title,
        content: finalContent,
        mainCategory: formData.mainCategory,
        subCategory: formData.subCategory,
        topic: formData.topic,
        description: formData.description,
        tags: formData.tags || [],
        thumbnail: formData.thumbnail,
        language: formData.language || 'ko'
      }
      
      const token = tokenStorage.getToken()
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }
      
      let response
      if (mode === 'create') {
        console.log('📤 Creating post:', API_URLS.POST.CREATE, submitData)
        response = await ApiFetch.postWithAuth(API_URLS.POST.CREATE, submitData)
      } else {
        const updateUrl = `${API_URLS.POST.UPDATE}/${postId}`
        console.log('📤 Updating post:', updateUrl)
        console.log('📋 Filtered submit data:', submitData)
        response = await ApiFetch.patchWithAuth(updateUrl, submitData)
      }
      
      if (response.ok) {
        const responseData = await response.json()
        
        // 임시저장 데이터 삭제
        if (mode === 'create') {
          localStorage.removeItem('temp_post')
        }
        
        console.log('✅ 포스트 저장 성공')
        
        // 성공 콜백 호출 (있으면)
        if (onSuccess) {
          await onSuccess(responseData)
        }
        
        // 리다이렉트 처리
        if (redirectPath === undefined) {
          // 기본 동작: 뷰 페이지로 이동
          router.push(`/post/view/${formData.mainCategory}`)
        } else if (redirectPath !== null) {
          // 커스텀 경로로 이동
          router.push(redirectPath)
        }
        // redirectPath가 null이면 이동하지 않음
        
      } else {
        const errorData = await response.json().catch(() => null)
        const errorMessage = errorData?.error || errorData?.message || `포스트 저장에 실패했습니다. (상태 코드: ${response.status})`
        console.error('❌ 포스트 저장 실패:', errorMessage, errorData)
        throw new Error(errorMessage)
      }
      
    } catch (error) {
      console.error('포스트 저장 실패:', error)
      const errorObj = error instanceof Error ? error : new Error('알 수 없는 오류가 발생했습니다.')
      
      setErrors({ submit: errorObj.message })
      
      // 에러 콜백 호출 (있으면)
      if (onError) {
        onError(errorObj)
      }
      
      // 에러를 다시 throw하여 상위에서 처리할 수 있도록 함
      throw errorObj
    } finally {
      setIsSaving(false)
    }
  }
  
  // 폼 리셋
  const resetForm = () => {
    if (originalDataRef.current) {
      setFormData({ ...originalDataRef.current })
    } else {
      setFormData({
        title: '',
        content: '',
        mainCategory: 'nextjs',
        subCategory: '',
        topic: '',
        description: '',
        tags: [],
        thumbnail: '',
        language: 'ko'
      })
    }
    setErrors({})
    setHasUnsavedChanges(false)
  }
  
  return {
    formData,
    updateFormData,
    setFormData,
    subCategories,
    selectedSubCategory,
    setSelectedSubCategory,
    viewMode,
    setViewMode,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    errors,
    localImages,
    setLocalImages,
    editorRef,
    handleSubmit,
    handleTempSave,
    validateForm,
    resetForm
  }
}
