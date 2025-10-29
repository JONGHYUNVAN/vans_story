/**
 * 통합 PostForm 컴포넌트
 * 생성과 편집을 모두 처리하는 통합 폼
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/utils/i18n'
import { PostFormProps, ViewMode } from '@/types/post'
import { usePost } from '@/hooks/usePost'
import { PostFormInputs } from './PostFormInputs'
import { PostPreview } from './PostPreview'
import { Editor } from '@/components/features/post/editor/Editor'

// 뷰 모드 토글 컴포넌트
interface ViewModeToggleProps {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  const { t } = useTranslation('')
  
  return (
    <div className="flex space-x-2 mb-4">
      <button
        type="button"
        onClick={() => setViewMode('edit')}
        className={`px-4 py-2 rounded ${
          viewMode === 'edit' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {t('post.edit.editMode') || '편집'}
      </button>
      <button
        type="button"
        onClick={() => setViewMode('preview')}
        className={`px-4 py-2 rounded ${
          viewMode === 'preview' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {t('post.edit.previewMode') || '미리보기'}
      </button>
    </div>
  )
}

export function PostForm({ 
  mode, 
  initialData,
  onSubmit,
  onTempSave 
}: PostFormProps) {
  const { t } = useTranslation('')
  const [isViewerMounted, setIsViewerMounted] = useState(false)
  const [localImages, setLocalImages] = useState<Map<string, File>>(new Map())
  const editorRef = useRef<any>(null)

  // 통합 Post 훅 사용
  const {
    formData,
    updateFormData,
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
    validateForm
  } = usePost({
    mode,
    postId: initialData?.id,
    initialData,
    autoSave: true,
    enableValidation: true
  })

  // 뷰어 마운트 상태
  useEffect(() => {
    setIsViewerMounted(true)
  }, [])

  // 커스텀 제출 핸들러
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await handleSubmit(e)
      
      // 커스텀 onSubmit 콜백 호출
      if (onSubmit) {
        await onSubmit(formData as any)
      }
    } catch (error) {
      console.error('폼 제출 실패:', error)
    }
  }

  // 커스텀 임시저장 핸들러
  const handleTempSaveClick = () => {
    handleTempSave()
    
    // 커스텀 onTempSave 콜백 호출
    if (onTempSave) {
      onTempSave(formData)
    }
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">포스트를 불러오는 중...</span>
      </div>
    )
  }

  // 에러 상태
  if (errors.load) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">오류!</strong>
          <span className="block sm:inline"> {errors.load}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {mode === 'create' 
                ? (t('post.create.title') || '새 글 작성하기')
                : (t('post.edit.title') || '포스트 편집')
              }
            </h1>
            <p className="text-gray-400">
              {mode === 'create' 
                ? (t('post.create.description') || '새로운 포스트를 작성해보세요')
                : (t('post.edit.description') || '포스트를 수정해보세요')
              }
            </p>
          </div>

          {/* 뷰 모드 토글 */}
          <ViewModeToggle 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
          />

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                {t('post.form.basicInfo') || '기본 정보'}
              </h2>
              <PostFormInputs
                data={formData}
                onChange={updateFormData}
                availableSubCategories={subCategories}
                selectedSubCategory={selectedSubCategory}
                onSubCategoryChange={setSelectedSubCategory}
                errors={errors}
                disabled={isSaving}
              />
            </div>

            {/* 에디터 / 미리보기 */}
            <div className="bg-gray-800 p-6 rounded-lg">
              {viewMode === 'edit' ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    {t('post.form.content') || '내용'}
                  </h2>
                  <Editor
                    editorRef={editorRef}
                    initialContent={formData.content || ''}
                    onChange={(content) => updateFormData('content', content)}
                    localImages={localImages}
                    setLocalImages={setLocalImages}
                  />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    {t('post.form.preview') || '미리보기'}
                  </h2>
                  <PostPreview
                    post={formData}
                    isViewerMounted={isViewerMounted}
                    showCard={true}
                    showLayout={true}
                  />
                </>
              )}
            </div>

            {/* 액션 버튼 및 상태 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 액션 버튼들 */}
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    {t('post.form.actions') || '작업'}
                  </h2>
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      {isSaving ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {mode === 'create' 
                            ? (t('post.create.submitting') || '작성 중...')
                            : (t('post.edit.submitting') || '수정 중...')
                          }
                        </span>
                      ) : (
                        mode === 'create' 
                          ? (t('post.create.submit') || '등록')
                          : (t('post.edit.submit') || '수정')
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleTempSaveClick}
                      disabled={isSaving}
                      className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      {t('post.form.tempSave') || '임시저장'}
                    </button>

                    {/* 변경사항 표시 */}
                    {hasUnsavedChanges && (
                      <div className="text-yellow-400 text-sm text-center">
                        {t('post.edit.unsavedChanges') || '저장되지 않은 변경사항이 있습니다'}
                      </div>
                    )}

                    {/* 에러 표시 */}
                    {errors.submit && (
                      <div className="text-red-400 text-sm text-center">
                        {errors.submit}
                      </div>
                    )}
                  </div>
                </div>

                {/* 상태 정보 */}
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    {t('post.form.status') || '상태'}
                  </h2>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div>메인 카테고리: {formData.mainCategory || '선택되지 않음'}</div>
                    <div>하위 카테고리: {formData.subCategory || '선택되지 않음'}</div>
                    <div>주제: {formData.topic || '입력되지 않음'}</div>
                    <div>언어: {formData.language || 'ko'}</div>
                    <div>태그: {formData.tags?.length || 0}개</div>
                    <div>변경사항: {hasUnsavedChanges ? '있음' : '없음'}</div>
                  </div>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
