/**
 * 에디터 전용 윈도우
 */

'use client'

import React from 'react'
import { Edit3 } from 'lucide-react'
import { Editor } from '@/components/features/post/editor/Editor'

interface PostContext {
  title?: string
  mainCategory?: string
  subCategory?: string
  topic?: string
  tags?: string[]
}

interface EditorWindowContentProps {
  editorRef?: React.MutableRefObject<unknown>
  initialContent?: unknown
  onChange?: (json: object) => void
  localImages: Map<string, File>
  setLocalImages: React.Dispatch<React.SetStateAction<Map<string, File>>>
  postContext?: PostContext
}

export function EditorWindowContent({
  editorRef,
  initialContent = '',
  onChange,
  localImages,
  setLocalImages,
  postContext
}: EditorWindowContentProps) {
  return (
    <div className="h-full bg-white/80 flex flex-col">
      <div className="flex-1 min-h-0 p-4">
        <Editor
          editorRef={editorRef}
          initialContent={initialContent}
          onChange={onChange}
          localImages={localImages}
          setLocalImages={setLocalImages}
          postContext={postContext}
        />
      </div>
    </div>
  )
}

// 기본 아이콘
export const EditorWindowIcon = () => <Edit3 size={14} />

