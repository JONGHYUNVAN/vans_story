import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/utils/i18n'
import { useCategories } from '@/hooks/useCategories'
import { getPost, updatePost, saveTempPost } from '@/app/api/posts/actions/client'
import type { Post, PostData } from '../types/post'

export type ViewMode = 'edit' | 'preview'

export function usePostEdit(postId: string) {
  const router = useRouter()
  const { t } = useTranslation('post')
  const [post, setPost] = useState<Post | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const { categories } = useCategories(post?.theme || 'spring', post?.language || 'ko')

  useEffect(() => {
    getPost(postId).then(setPost)
  }, [postId])

  const handleSubmit = useCallback(async () => {
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

    if (!postData.title || !postData.content || !postData.theme || !postData.topic || 
        !postData.description || !postData.category || !postData.language) {
      alert(t('post.create.validation'))
      return
    }

    try {
      await updatePost(postId, postData)
      router.push(`/post/view/${post.theme}/category/${post.categoryId}`)
    } catch (error) {
      alert(t('post.updateError.default'))
    }
  }, [post, postId, router, t])

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