import { BubbleMenu, Editor } from '@tiptap/react'

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
      tippyOptions={{ duration: 100 }}
      className="flex bg-white shadow-lg border rounded-lg overflow-hidden divide-x"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 hover:bg-gray-100 ${
          editor.isActive('bold') ? 'bg-gray-100' : ''
        }`}
      >
        굵게
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 hover:bg-gray-100 ${
          editor.isActive('italic') ? 'bg-gray-100' : ''
        }`}
      >
        기울임
      </button>
      <button
        onClick={() => {
          const url = window.prompt('URL을 입력하세요:')
          if (url) {
            editor.chain().focus().setLink({ href: url }).run()
          }
        }}
        className={`p-2 hover:bg-gray-100 ${
          editor.isActive('link') ? 'bg-gray-100' : ''
        }`}
      >
        링크
      </button>
    </BubbleMenu>
  )
}
