import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_URLS } from '@/constants/apiUrl'
import { tokenStorage } from '@/utils/token'
import { ApiWrapper } from '@/utils/apiWrapper'
import { useTranslation } from '@/utils/i18n'
import { PostCreateData } from '../types/post'
import { useImageUploadAndReplace } from '@/hooks/useImageUploadAndReplace'

export function usePostCreate(editorRef?: React.MutableRefObject<any>, localImages?: Map<string, File>) {
  const router = useRouter()
  const { t } = useTranslation('')
  
  const [formData, setFormData] = useState<PostCreateData>({
    title: '',
    content: '',
    theme: 'nextjs',
    topic: '',
    description: '',
    tags: [],
    category: '',
    thumbnail: '',
    language: 'ko'
  })

  // 임시저장 데이터 로드
  useEffect(() => {
    const savedPost = localStorage.getItem('temp_post')
    if (savedPost) {
      try {
        const postData = JSON.parse(savedPost)
        setFormData(prev => ({
          ...prev,
          ...postData,
          category: postData.category || ''
        }))
      } catch (error) {
        console.error(t('post.create.tempSaveError'), error)
      }
    }
  }, [t])

  const updateFormData = (field: keyof PostCreateData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 이미지 업로드 및 치환 훅 사용
  const { uploadAndReplace } = useImageUploadAndReplace(localImages || new Map())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const missingFields = []
    if (!formData.title) missingFields.push('제목')
    if (!formData.content) missingFields.push('내용')
    if (!formData.theme) missingFields.push('테마')
    if (!formData.topic) missingFields.push('주제')
    if (!formData.description) missingFields.push('설명')
    if (!formData.category) missingFields.push('카테고리')
    if (!formData.language) missingFields.push('언어')

    if (missingFields.length > 0) {
      alert(`다음 항목을 입력해주세요:\n${missingFields.join(', ')}`)
      return
    }

    try {
      const token = tokenStorage.getToken()
      if (!token) {
        throw new Error('로그인이 필요합니다.')
      }

      // editorRef에서 HTML 추출
      const html = editorRef?.current?.getHTML ? editorRef.current.getHTML() : formData.content
      // 이미지 업로드 및 src 치환
      const finalHtml = await uploadAndReplace(html)
      const response = await ApiWrapper.post(API_URLS.POST.CREATE, {
        ...formData,
        content: finalHtml
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || t('post.create.submitError'))
      }

      if (!data?._id) {
        throw new Error('게시글 ID를 받지 못했습니다.')
      }

      localStorage.removeItem('temp_post')
      router.push(`/post/view/${formData.theme}/${data._id}`)
    } catch (error) {
      console.error('Error submitting post:', error)
      alert(error instanceof Error ? error.message : t('post.create.submitError'))
    }
  }

  const handleTempSave = () => {
    if (Object.values(formData).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value !== ''
    })) {
      localStorage.setItem('temp_post', JSON.stringify(formData))
      alert(t('post.create.tempSaveSuccess'))
    }
  }

  return {
    formData,
    updateFormData,
    handleSubmit,
    handleTempSave
  }
} 