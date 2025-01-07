import { Editor } from '@tiptap/react'

interface EditorMenuBarProps {
  editor: Editor
}

/**
 * 에디터 상단 메뉴바 컴포넌트
 * @component
 */
export function EditorMenuBar({ editor }: EditorMenuBarProps) {
  return (
    <div className="border-b border-gray-200 p-2 flex gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        굵게
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        기울임
      </button>
      {/* 추가 버튼들... */}
    </div>
  )
}