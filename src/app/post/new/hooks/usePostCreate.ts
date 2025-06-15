import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_URLS } from '@/constants/apiUrl'
import { tokenStorage } from '@/utils/token'
import { ApiFetch } from '@/app/api/apiFetch/apiFetch'
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
      }
    }
  }, [t])

  const updateFormData = (field: keyof PostCreateData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

      // 컨텐츠 처리: 서버가 객체를 요구하므로 객체 그대로 전송
      let finalContent;
      if (typeof formData.content === 'object' && formData.content !== null) {
        // formData.content가 객체인 경우 그대로 사용 (서버가 객체를 요구)
        finalContent = formData.content;
      } else {
        // 문자열인 경우 빈 에디터 JSON 구조로 변환
        finalContent = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: formData.content || ''
                }
              ]
            }
          ]
        };
      }

      // JSON 객체 내 이미지 업로드 처리
      const processContentImages = async (content: any): Promise<any> => {
        if (!content || typeof content !== 'object') return content;
        
        if (Array.isArray(content)) {
          return Promise.all(content.map(item => processContentImages(item)));
        }
        
        // 이미지 노드인 경우 백엔드로 업로드
        if (content.type === 'resizableDraggableImage' && content.attrs?.src) {
          const originalSrc = content.attrs.src;
          
          if (originalSrc.startsWith('blob:') || originalSrc.startsWith('data:')) {
            try {
              // blob URL에서 실제 파일 데이터 추출
              const response = await fetch(originalSrc);
              const blob = await response.blob();
              
              // FormData로 파일 업로드
              const formData = new FormData();
              formData.append('image', blob, 'image.png');
              
              const uploadResponse = await ApiFetch.filePost(API_URLS.POST.UPLOAD_IMAGE, formData);
              
              if (!uploadResponse.ok) {
                throw new Error('이미지 업로드 실패');
              }
              
              const uploadResult = await uploadResponse.json();
              const uploadedSrc = uploadResult.fileName || uploadResult.url || uploadResult.imageUrl;
              
              
              return {
                ...content,
                attrs: {
                  ...content.attrs,
                  src: uploadedSrc
                }
              };
            } catch (error) {
              throw new Error(`이미지 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            }
          }
        }
        
        // 재귀적으로 하위 content 처리
        const processedContent = { ...content };
        if (content.content) {
          processedContent.content = await processContentImages(content.content);
        }
        
        return processedContent;
      };

      // 이미지 업로드 처리
      finalContent = await processContentImages(finalContent);
      
      const submitData = {
        ...formData,
        content: finalContent
      };

      const response = await ApiFetch.authPost(API_URLS.POST.CREATE, submitData)

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