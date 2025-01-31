'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import { EditorMenuBar } from './EditorMenuBar'
import { EditorBubbleMenu } from './EditorBubbleMenu'
import { EditorProvider } from './EditorContext'
import { common, createLowlight } from 'lowlight'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import rust from 'highlight.js/lib/languages/rust'
import go from 'highlight.js/lib/languages/go'
import sql from 'highlight.js/lib/languages/sql'
import ruby from 'highlight.js/lib/languages/ruby'
import swift from 'highlight.js/lib/languages/swift'
import kotlin from 'highlight.js/lib/languages/kotlin'
import php from 'highlight.js/lib/languages/php'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import bash from 'highlight.js/lib/languages/bash'
import markdown from 'highlight.js/lib/languages/markdown'
import { EditorExtensions } from './EditorExtensions'


interface EditorProps {
  /** 초기 에디터 컨텐츠 */
  initialContent?: string
  /** 에디터 내용이 변경될 때 호출되는 콜백 */
  onChange?: (html: string) => void
  /** 에디터 읽기 전용 모드 */
  readonly?: boolean
}

/**
 * Tiptap 기반의 리치 텍스트 에디터
 * @component
 */
export function Editor({ initialContent = '', onChange, readonly = false }: EditorProps) {
  const editor = useEditor({
    extensions: EditorExtensions,
    content: initialContent,
    immediatelyRender: false,
    editable: !readonly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <EditorProvider value={editor}>
      <div className="relative">
        <EditorMenuBar />
        <EditorBubbleMenu />
        <div className="prose max-w-none">
          <EditorContent 
            editor={editor} 
            className="min-h-[60vh] border border-gray-200 rounded-lg p-0 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
          />
        </div>
      </div>
    </EditorProvider>
  )
}