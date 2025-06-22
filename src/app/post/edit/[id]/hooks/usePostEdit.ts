import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/utils/i18n'
import { useCategories } from '@/hooks/useCategories'
import { getPostForEdit, updatePost, saveTempPost } from '@/app/api/posts/actions/client'
import { tokenStorage } from '@/utils/token'
import { API_URLS } from '@/constants/apiUrl'
import { ApiFetch } from '@/app/api/apiFetch/apiFetch'
import type { Post, PostData } from '../types/post'

export type ViewMode = 'edit' | 'preview'

export function usePostEdit(postId: string) {
  const router = useRouter()
  const { t } = useTranslation('')
  const [post, setPost] = useState<Post | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const originalPostRef = useRef<Post | null>(null) // 원본 데이터 저장
  const { categories, selectedCategory, setSelectedCategory } = useCategories(post?.theme || 'spring', post?.language || 'ko')

  useEffect(() => {
    getPostForEdit(postId).then((fetchedPost) => {
      setPost(fetchedPost)
      originalPostRef.current = fetchedPost // 원본 데이터 저장
    })
  }, [postId])

  // post가 로드된 후 해당 카테고리를 선택
  useEffect(() => {
    if (post && categories.length > 0) {
      const currentCategory = categories.find(cat => cat.value === post.categoryId);
      if (currentCategory) {
        setSelectedCategory(currentCategory);
      }
    }
  }, [post, categories, setSelectedCategory])

  // 변경된 필드만 추출하는 유틸리티 함수
  const getChangedFields = useCallback(() => {
    if (!post || !originalPostRef.current) return null;

    const original = originalPostRef.current;
    const changedFields: Partial<PostData> = {};

    // 각 필드를 비교하여 변경된 것만 추가
    if (post.title !== original.title) {
      changedFields.title = post.title;
    }
    if (JSON.stringify(post.content) !== JSON.stringify(original.content)) {
      changedFields.content = post.content;
    }
    if (post.theme !== original.theme) {
      changedFields.theme = post.theme;
    }
    if (post.topic !== original.topic) {
      changedFields.topic = post.topic;
    }
    if (post.description !== original.description) {
      changedFields.description = post.description;
    }
    if (JSON.stringify(post.tags) !== JSON.stringify(original.tags)) {
      changedFields.tags = post.tags;
    }
    if (post.categoryId !== original.categoryId) {
      changedFields.category = post.categoryId;
    }
    if (post.thumbnail !== original.thumbnail) {
      changedFields.thumbnail = post.thumbnail;
    }
    if (post.language !== original.language) {
      changedFields.language = post.language;
    }

    return Object.keys(changedFields).length > 0 ? changedFields : null;
  }, [post]);

  const handleSubmit = useCallback(async () => {
    if (!post) return;

    // 변경된 필드만 추출
    const changedFields = getChangedFields();
    if (!changedFields) {
      alert(t('post.noChanges') || '변경사항이 없습니다.');
      return;
    }

    // content가 변경된 경우에만 이미지 처리 수행
    let finalContent = changedFields.content;
    if (changedFields.content) {
      // content가 문자열인 경우 객체로 파싱
      if (typeof changedFields.content === 'string' && changedFields.content.startsWith('{')) {
        try {
          finalContent = JSON.parse(changedFields.content as string);
        } catch (error) {
          console.warn('Content 파싱 실패:', error);
        }
      }

      // JSON 객체 내 이미지 업로드 처리 (New 페이지와 동일한 로직)
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
                const errorText = await uploadResponse.text();
                throw new Error(`이미지 업로드 실패: ${uploadResponse.status} - ${errorText}`);
              }
              
              const uploadResult = await uploadResponse.json();
              const uploadedSrc = uploadResult.fileName || uploadResult.url || uploadResult.imageUrl || uploadResult.data?.url || uploadResult.data?.imageUrl;
              
              if (!uploadedSrc) {
                throw new Error('서버 응답에 이미지 URL이 없습니다');
              }
              
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
      changedFields.content = finalContent;
    }

    try {
      await updatePost(postId, changedFields as PostData) // 변경된 필드만 전송
      
      // 게시글 수정 후 해당 게시글 상세 페이지로 리다이렉트
      router.push(`/post/view/${post.theme}/${postId}`)
    } catch (error) {
      alert(t('post.updateError.default'))
    }
  }, [post, postId, router, t, getChangedFields])

  const handleTempSave = useCallback(() => {
    if (!post) return;

    const postData: PostData = {
      title: post.title,
      content: post.content,
      theme: post.theme,
      topic: post.topic,
      description: post.description,
      tags: post.tags,
      category: post.categoryId,
      thumbnail: post.thumbnail,
      language: post.language
    }

    if (saveTempPost(postId, postData)) {
      alert(t('post.create.tempSaveSuccess'))
    }
  }, [post, postId, t])

  return {
    post,
    setPost,
    viewMode,
    setViewMode,
    categories,
    selectedCategory,
    setSelectedCategory,
    handleSubmit,
    handleTempSave,
    currentPostData: post ? {
      title: post.title,
      content: post.content,
      theme: post.theme,
      topic: post.topic,
      description: post.description,
      tags: post.tags,
      category: post.categoryId,
      thumbnail: post.thumbnail,
      language: post.language
    } : null
  }
} 