import { BubbleMenu, Editor } from '@tiptap/react'
import { Bold, Italic, Underline, Palette, Type } from 'lucide-react'

interface EditorBubbleMenuProps {
  editor: Editor
}

/**
 * 텍스트 선택 시 나타나는 버블 메뉴 컴포넌트
 * @component
 */
export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  if (!editor) return null

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => editor.isActive('textStyle')}
      className="flex items-center bg-white shadow-lg border rounded-lg overflow-hidden"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 hover:bg-gray-100 transition-colors ${
          editor.isActive('bold') ? 'bg-gray-100' : ''
        }`}
      >
        <Bold size={14} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 hover:bg-gray-100 transition-colors ${
          editor.isActive('italic') ? 'bg-gray-100' : ''
        }`}
      >
        <Italic size={14} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 hover:bg-gray-100 transition-colors ${
          editor.isActive('underline') ? 'bg-gray-100' : ''
        }`}
      >
        <Underline size={14} />
      </button>
      <button
        className={`p-1.5 hover:bg-gray-100 transition-colors`}
        title="글자 색상"
      >
        <Palette size={14} />
      </button>
      <button
        className={`p-1.5 hover:bg-gray-100 transition-colors`}
        title="글자 크기"
      >
        <Type size={14} />
      </button>
    </BubbleMenu>
  )
}
