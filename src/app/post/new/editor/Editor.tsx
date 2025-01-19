'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import { EditorExtensions } from './EditorExtensions'
import { EditorMenuBar } from './EditorMenuBar'
import { EditorBubbleMenu } from './EditorBubbleMenu'
import { EditorProvider } from './EditorContext'

interface EditorProps {
  /** 초기 에디터 컨텐츠 */
  initialContent?: string
  /** 에디터 내용이 변경될 때 호출되는 콜백 */
  onChange?: (html: string) => void
  /** 에디터 읽기 전용 모드 */
  readonly?: boolean
}

/**
 * Tiptap 기반의 리치 텍스트 에디터 컴포넌트
 * @component
 */
export function Editor({ initialContent = '', onChange, readonly = false }: EditorProps) {
  const editor = useEditor({
    extensions: EditorExtensions,
    content: initialContent,
    editable: !readonly,
    immediatelyRender: false,
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
        <EditorContent editor={editor} className="prose max-w-none p-4" />
      </div>
    </EditorProvider>
  )
}