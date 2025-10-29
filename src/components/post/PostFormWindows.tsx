/**
 * Windows 11 스타일 PostForm
 * 다중 윈도우 기반 레이아웃
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/utils/i18n'
import { PostFormProps } from '@/types/post'
import { usePost } from '@/hooks/usePost'
import { WindowManagerProvider, useWindowManager, Window } from '@/components/ui/window'
import { Taskbar } from '@/components/ui/window/Taskbar'
import {
  FormWindowContent,
  FormWindowIcon,
} from '@/components/ui/window/windows/FormWindow'
import {
  EditorWindowContent,
  EditorWindowIcon,
} from '@/components/ui/window/windows/EditorWindow'
import {
  PreviewWindowContent,
  PreviewWindowIcon,
} from '@/components/ui/window/windows/PreviewWindow'
import {
  AiChatWindowContent,
  AiChatWindowIcon,
} from '@/components/ui/window/windows/AiChatWindow'

function PostFormWindowsContent({ mode, initialData, onSubmit, onTempSave }: PostFormProps) {
  const { t } = useTranslation('')
  const [localImages, setLocalImages] = useState<Map<string, File>>(new Map())
  const editorRef = useRef<any>(null)
  const { createWindow, windows } = useWindowManager()

  // 통합 Post 훅 사용
  const {
    formData,
    updateFormData,
    subCategories,
    selectedSubCategory,
    setSelectedSubCategory,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    errors,
    handleSubmit,
    handleTempSave,
  } = usePost({
    mode,
    postId: initialData?.id,
    initialData,
    autoSave: true,
    enableValidation: true,
  })

  // 초기 윈도우들 생성
  useEffect(() => {
    // 약간의 지연을 두고 윈도우 생성 (localStorage 복원 이후)
    const timer = setTimeout(() => {
      // 폼 윈도우
      if (!windows.has('form-window')) {
        createWindow({
          id: 'form-window',
          type: 'form',
          title: '포스트 정보',
          icon: <FormWindowIcon />,
          position: { x: 50, y: 50 },
          size: { width: 500, height: 700 },
          minSize: { width: 400, height: 500 },
          state: 'normal',
        })
      }

      // 에디터 윈도우
      if (!windows.has('editor-window')) {
        createWindow({
          id: 'editor-window',
          type: 'editor',
          title: '에디터',
          icon: <EditorWindowIcon />,
          position: { x: 600, y: 50 },
          size: { width: 800, height: 700 },
          minSize: { width: 500, height: 400 },
          state: 'normal',
        })
      }

      // 미리보기 윈도우
      if (!windows.has('preview-window')) {
        createWindow({
          id: 'preview-window',
          type: 'preview',
          title: '미리보기',
          icon: <PreviewWindowIcon />,
          position: { x: 100, y: 100 },
          size: { width: 900, height: 800 },
          minSize: { width: 600, height: 400 },
          state: 'minimized', // 기본적으로 최소화
        })
      }

      // AI 채팅 윈도우
      if (!windows.has('ai-chat-window')) {
        createWindow({
          id: 'ai-chat-window',
          type: 'ai-chat',
          title: 'AI 어시스턴트',
          icon: <AiChatWindowIcon />,
          position: { x: 150, y: 150 },
          size: { width: 450, height: 600 },
          minSize: { width: 350, height: 400 },
          state: 'minimized', // 기본적으로 최소화
        })
      }
    }, 100) // 100ms 지연

    return () => clearTimeout(timer)
  }, [windows, createWindow]) // windows가 변경될 때도 체크

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

  // AI에서 에디터로 텍스트 삽입
  const handleInsertTextToEditor = (text: string) => {
    if (editorRef.current) {
      const editor = editorRef.current
      editor.commands.insertContent(text)
    }
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="text-white">포스트를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (errors.load) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-6 py-4 rounded-lg">
          <strong className="font-bold">오류!</strong>
          <span className="block sm:inline ml-2">{errors.load}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 배경 데스크톱 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-gray-400 mb-3">
              {mode === 'create' ? '새 글 작성' : '포스트 편집'}
            </h1>
            <p className="text-gray-300 text-sm">
               멀티 윈도우 에디터
            </p>
          </div>
          
          {/* 설명명 */}
          <div className="mt-12 space-y-2 text-gray-300 text-xs">
            <p>• 윈도우를 드래그하여 이동하세요</p>
            <p>• 모서리를 드래그하여 크기를 조절하세요</p>
            <p>• 작업표시줄에서 윈도우를 관리하세요</p>
          </div>
        </div>
      </div>

      {/* 폼 윈도우 */}
      <Window id="form-window">
        <form onSubmit={handleFormSubmit} className="h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <FormWindowContent
              data={formData}
              onChange={updateFormData}
              availableSubCategories={subCategories}
              selectedSubCategory={selectedSubCategory}
              onSubCategoryChange={setSelectedSubCategory}
              errors={errors}
              disabled={isSaving}
            />
          </div>

          {/* 액션 버튼 영역 */}
          <div className="p-4 border-t border-gray-200 bg-white/60 space-y-2.5">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md disabled:shadow-none"
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-sm">{mode === 'create' ? '작성 중...' : '수정 중...'}</span>
                </span>
              ) : (
                <span className="text-sm">{mode === 'create' ? '포스트 등록' : '포스트 수정'}</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleTempSaveClick}
              disabled={isSaving}
              className="w-full bg-gray-200/60 hover:bg-gray-300/60 disabled:bg-gray-100/60 text-gray-700 hover:text-gray-900 disabled:text-gray-400 font-medium py-3 px-4 rounded-lg transition-all border border-gray-300"
            >
              <span className="text-sm">임시저장</span>
            </button>

            {/* 상태 표시 */}
            {hasUnsavedChanges && (
              <div className="flex items-center justify-center gap-1.5 text-yellow-700 text-xs py-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                <span>저장되지 않은 변경사항이 있습니다</span>
              </div>
            )}

            {errors.submit && (
              <div className="flex items-center justify-center gap-1.5 text-red-700 text-xs py-2 bg-red-50 rounded-lg border border-red-200">
                <span>{errors.submit}</span>
              </div>
            )}
          </div>
        </form>
      </Window>

      {/* 에디터 윈도우 */}
      <Window id="editor-window">
        <EditorWindowContent
          editorRef={editorRef}
          initialContent={formData.content || ''}
          onChange={(content) => updateFormData('content', content)}
          localImages={localImages}
          setLocalImages={setLocalImages}
        />
      </Window>

      {/* 미리보기 윈도우 */}
      <Window id="preview-window">
        <PreviewWindowContent
          post={formData}
          showCard={true}
          showLayout={true}
        />
      </Window>

      {/* AI 채팅 윈도우 */}
      <Window id="ai-chat-window">
        <AiChatWindowContent onInsertText={handleInsertTextToEditor} />
      </Window>

      {/* 작업표시줄 */}
      <Taskbar />
    </div>
  )
}

export function PostFormWindows(props: PostFormProps) {
  return (
    <WindowManagerProvider persistKey="post-editor-windows">
      <PostFormWindowsContent {...props} />
    </WindowManagerProvider>
  )
}

