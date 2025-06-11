'use client'

import { useState, useEffect } from 'react'
import { Editor } from '@/components/editor/Editor'
import { PostHeader } from './PostHeader'
import { useTranslation } from '@/utils/i18n'
import { PostFormInputs } from './PostFormInputs'
import { useCategories } from '@/hooks/useCategories'
import { PostPreview } from '@/components/editor/EditorPreview'
import { PostCreateViewMode } from './PostCreateViewMode'
import { usePostCreate } from '../hooks/usePostCreate'
import { ViewMode } from '../types/post'

// 언어 옵션 배열
const LANGUAGES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' }
]

export function PostCreateForm() {
  const { t } = useTranslation('')
  const { formData, updateFormData, handleSubmit, handleTempSave } = usePostCreate()
  
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [isViewerMounted, setIsViewerMounted] = useState(false)

  // 카테고리 관리 훅 사용
  const { categories, selectedCategory, setSelectedCategory } = useCategories(formData.theme, formData.language)

  useEffect(() => {
    if (viewMode === 'preview') {
      const timer = setTimeout(() => {
        setIsViewerMounted(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setIsViewerMounted(false)
    }
  }, [viewMode])

  return (
    <form id="post-form" onSubmit={handleSubmit}>
      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333333] rounded-lg p-8">
        <PostHeader 
          postData={{
            ...formData,
            category: selectedCategory?.value || ''
          }}
          onSubmit={handleSubmit}
          onTempSave={handleTempSave}
        />
        
        <PostCreateViewMode
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {viewMode === 'edit' ? (
          <div className="space-y-6">
            <PostFormInputs
              title={formData.title}
              setTitle={(value) => updateFormData('title', value)}
              topic={formData.topic}
              setTopic={(value) => updateFormData('topic', value)}
              description={formData.description}
              setDescription={(value) => updateFormData('description', value)}
              theme={formData.theme}
              setTheme={(value) => updateFormData('theme', value)}
              language={formData.language}
              setLanguage={(value) => updateFormData('language', value)}
              category={selectedCategory}
              setCategory={setSelectedCategory}
              thumbnail={formData.thumbnail}
              setThumbnail={(value) => updateFormData('thumbnail', value)}
              tags={formData.tags}
              setTags={(value) => updateFormData('tags', value)}
              availableCategories={categories}
            />
            <Editor
              initialContent={formData.content}
              onChange={(value) => updateFormData('content', value)}
            />
          </div>
        ) : (
          <PostPreview
            id="preview"
            title={formData.title}
            content={formData.content}
            theme={formData.theme}
            topic={formData.topic}
            description={formData.description}
            tags={formData.tags}
            category={selectedCategory?.value || ''}
            thumbnail={formData.thumbnail}
            language={formData.language}
            isViewerMounted={isViewerMounted}
          />
        )}
      </div>
    </form>
  )
}