'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import { EditorMenuBar } from './EditorMenuBar'
import { EditorBubbleMenu } from './EditorBubbleMenu'
import { EditorProvider } from './EditorContext'
import { EditorExtensions } from './EditorExtensions'
import { useEffect } from 'react'


interface EditorProps {
  /** 초기 에디터 컨텐츠 */
  initialContent?: any // string | object 모두 허용
  /** 에디터 내용이 변경될 때 호출되는 콜백 */
  onChange?: (json: object) => void
  /** 에디터 읽기 전용 모드 */
  readonly?: boolean
  localImages: Map<string, File>
  setLocalImages: React.Dispatch<React.SetStateAction<Map<string, File>>>
  editorRef?: React.MutableRefObject<any>
}

/**
 * Tiptap 기반의 리치 텍스트 에디터
 * @component
 */
export function Editor({ initialContent = '', onChange, readonly = false, localImages, setLocalImages, editorRef }: EditorProps) {
  const editor = useEditor({
    extensions: EditorExtensions,
    content: initialContent,
    immediatelyRender: false,
    editable: !readonly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  // editorRef에 editor 인스턴스 할당
  if (editorRef) {
    editorRef.current = editor;
  }

  // content가 변경될 때 에디터 내용 업데이트
  useEffect(() => {
    if (editor && JSON.stringify(initialContent) !== JSON.stringify(editor.getJSON())) {
      editor.commands.setContent(initialContent)
    }
  }, [editor, initialContent])

  if (!editor) return null

  return (
    <EditorProvider value={editor}>
      <div className="relative">
        <EditorMenuBar localImages={localImages} setLocalImages={setLocalImages} />
        <div className="prose max-w-none">
          <EditorContent 
            editor={editor} 
            className="min-h-[60vh] border border-gray-200 rounded-lg p-4 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
          />
        </div>
        <EditorBubbleMenu />
      </div>
    </EditorProvider>
  )
}