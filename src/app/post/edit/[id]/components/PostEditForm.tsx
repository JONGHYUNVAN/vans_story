'use client'

import { Editor } from '@/components/editor/Editor'
import { PostFormInputs } from '@/app/post/new/components/PostFormInputs'
import { PostPreview } from '../../../../../components/editor/EditorPreview'
import { PostEditHeader } from './PostEditHeader'
import { PostEditViewMode } from './PostEditViewMode'
import { usePostEdit } from '../hooks/usePostEdit'
import type { PostEditFormProps } from '../types/post'
import { useEffect } from 'react'

export function PostEditForm({ postId }: PostEditFormProps) {
  const {
    post,
    setPost,
    viewMode,
    setViewMode,
    categories,
    handleSubmit,
    handleTempSave,
    currentPostData
  } = usePostEdit(postId)

  useEffect(() => {
    const handlePostSubmit = (e: CustomEvent) => {
      if (e.detail.postId === postId) {
        handleSubmit()
      }
    }

    const handlePostTempSave = (e: CustomEvent) => {
      if (e.detail.postId === postId) {
        handleTempSave()
      }
    }

    window.addEventListener('postSubmit', handlePostSubmit as EventListener)
    window.addEventListener('postTempSave', handlePostTempSave as EventListener)

    return () => {
      window.removeEventListener('postSubmit', handlePostSubmit as EventListener)
      window.removeEventListener('postTempSave', handlePostTempSave as EventListener)
    }
  }, [postId, handleSubmit, handleTempSave])

  const handleEditorChange = (json: object) => {
    if (post) {
      setPost({ ...post, content: JSON.stringify(json) })
    }
  }

  return (
    <>
      <PostEditHeader 
        postId={postId}
        postData={currentPostData || {
          title: '',
          content: '',
          theme: 'spring',
          topic: '',
          description: '',
          tags: [],
          category: '',
          thumbnail: '',
          language: 'ko'
        }}
      />
      
      <PostEditViewMode viewMode={viewMode} />

      {viewMode === 'edit' ? (
        <div className="space-y-6">
          <PostFormInputs
            title={post?.title || ''}
            setTitle={(title) => post && setPost({ ...post, title })}
            topic={post?.topic || ''}
            setTopic={(topic) => post && setPost({ ...post, topic })}
            description={post?.description || ''}
            setDescription={(description) => post && setPost({ ...post, description })}
            theme={post?.theme || 'spring'}
            setTheme={(theme) => post && setPost({ ...post, theme })}
            language={post?.language || 'ko'}
            setLanguage={(language) => post && setPost({ ...post, language })}
            category={categories.find(c => c.value === post?.categoryId) || null}
            setCategory={(category) => post && setPost({ ...post, categoryId: category?.value || '' })}
            thumbnail={post?.thumbnail || ''}
            setThumbnail={(thumbnail) => post && setPost({ ...post, thumbnail })}
            tags={post?.tags || []}
            setTags={(tags) => post && setPost({ ...post, tags })}
            availableCategories={categories}
          />
          <Editor initialContent={post?.content || ''} onChange={handleEditorChange} />
        </div>
      ) : (
        <div className="bg-black -mx-8 -mb-8 mt-4 p-8">
          <PostPreview
            id={postId}
            title={post?.title || ''}
            content={post?.content || ''}
            theme={post?.theme || 'spring'}
            topic={post?.topic || ''}
            description={post?.description || ''}
            tags={post?.tags || []}
            category={post?.categoryId || ''}
            thumbnail={post?.thumbnail || ''}
            language={post?.language || 'ko'}
          />
        </div>
      )}
    </>
  )
} 