'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [isViewerMounted, setIsViewerMounted] = useState(false)

  // localImages 상태와 editorRef 추가
  const [localImages, setLocalImages] = useState<Map<string, File>>(new Map())
  const editorRef = useRef<any>(null)

  // usePostCreate 훅에 editorRef, localImages 전달
  const { formData, updateFormData, handleSubmit, handleTempSave } = usePostCreate(editorRef, localImages)

  // 카테고리 관리 훅 사용 (formData 이후)
  const { categories, selectedCategory, setSelectedCategory } = useCategories(formData.theme, formData.language)

  // selectedCategory가 변경될 때 formData.category도 자동 업데이트
  useEffect(() => {
    if (selectedCategory && selectedCategory.value !== formData.category) {
      console.log('🔄 카테고리 자동 동기화:', selectedCategory.label);
      updateFormData('category', selectedCategory.value);
    }
  }, [selectedCategory, formData.category, updateFormData]);

  // 테마/언어 변화 추적
  useEffect(() => {
    console.log('🎨 테마/언어 변화 감지');
    console.log('- theme:', formData.theme);
    console.log('- language:', formData.language);
  }, [formData.theme, formData.language]);

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
              setCategory={(cat) => {
                console.log('🎯 카테고리 선택 변경:', cat?.label || 'null');
                setSelectedCategory(cat);
                updateFormData('category', cat?.value || '');
              }}
              thumbnail={formData.thumbnail}
              setThumbnail={(value) => updateFormData('thumbnail', value)}
              tags={formData.tags}
              setTags={(value) => updateFormData('tags', value)}
              availableCategories={categories}
            />
            <Editor
              initialContent={formData.content}
              onChange={(value) => updateFormData('content', value)}
              localImages={localImages}
              setLocalImages={setLocalImages}
              editorRef={editorRef}
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