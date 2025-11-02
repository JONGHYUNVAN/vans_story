'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import { EditorMenuBar } from './EditorMenuBar'
import { EditorBubbleMenu } from './EditorBubbleMenu'
import { EditorProvider } from './EditorContext'
import { EditorExtensions } from './EditorExtensions'
import { useEffect } from 'react'


interface PostContext {
  title?: string
  mainCategory?: string
  subCategory?: string
  topic?: string
  tags?: string[]
}

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
  /** 포스트 컨텍스트 정보 (AI 생성용) */
  postContext?: PostContext
}

/**
 * Tiptap 기반의 리치 텍스트 에디터
 * @component
 */
export function Editor({ initialContent = '', onChange, readonly = false, localImages, setLocalImages, editorRef, postContext }: EditorProps) {
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
      <div className="flex flex-col h-full">
        <EditorMenuBar localImages={localImages} setLocalImages={setLocalImages} postContext={postContext} />
        <div className="flex-1 min-h-0 relative">
          <EditorContent 
            editor={editor} 
            className="prose prose-gray max-w-none h-full border border-gray-300 rounded-lg p-4 bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-auto"
          />
        </div>
        <EditorBubbleMenu />
      </div>
    </EditorProvider>
  )
}