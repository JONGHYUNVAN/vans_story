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
import { ApiFetch } from '@/app/api/apiFetch/apiFetch'
import { getPostForEdit, saveTempPost } from '@/app/api/posts/actions/client'

export interface UsePostOptions {
  mode: 'create' | 'edit'
  postId?: string
  initialData?: Partial<PostEditData>
  autoSave?: boolean
  enableValidation?: boolean
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
  enableValidation = true
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
    
    // 메인 카테고리 변경시 하위 카테고리 리셋
    if (field === 'mainCategory') {
      setSelectedSubCategory(null)
      setFormData(prev => ({
        ...prev,
        subCategory: ''
      }))
    }
  }
  
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
      
      // API 호출용 데이터 준비
      const submitData = {
        ...formData,
        content: finalContent
      } as PostCreateData | PostEditData
      
      const token = tokenStorage.getToken()
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }
      
      let response
      if (mode === 'create') {
        response = await ApiFetch.post_withAuth(API_URLS.POST.CREATE, submitData)
      } else {
        response = await ApiFetch.post_withAuth(`${API_URLS.POST.UPDATE}/${postId}`, submitData)
      }
      
      if (response.ok) {
        // 임시저장 데이터 삭제
        if (mode === 'create') {
          localStorage.removeItem('temp_post')
        }
        
        // 성공 후 이동
        router.push(`/post/view/${formData.mainCategory}`)
        console.log('✅ 포스트 저장 성공')
      } else {
        throw new Error('포스트 저장에 실패했습니다.')
      }
      
    } catch (error) {
      console.error('포스트 저장 실패:', error)
      setErrors({ submit: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' })
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
    handleSubmit,
    handleTempSave,
    validateForm,
    resetForm
  }
}
