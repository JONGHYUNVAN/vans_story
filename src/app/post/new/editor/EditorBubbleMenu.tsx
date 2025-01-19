'use client'
import { BubbleMenu } from '@tiptap/react'
import { Bold, Italic, Underline, Palette, Type } from 'lucide-react'
import { useEditorContext } from './EditorContext'

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '40']

/**
 * 텍스트 선택 시 나타나는 버블 메뉴 컴포넌트
 * @component
 */
export function EditorBubbleMenu() {
  const editor = useEditorContext()
  if (!editor) return null

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor, state }) => {
        const { selection } = state
        return !selection.empty
      }}
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
      {/* 글자색 */}
      <div className="relative flex items-center" title="글자색">
        <div className="absolute left-1.5 pointer-events-none">
          <span className="text-xs font-bold">A</span>
          <Palette size={14} className="text-gray-500" />
        </div>
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="w-8 h-8 p-1 opacity-0 cursor-pointer"
        />
      </div>

      {/* 글자 크기 */}
      <div className="relative">
        <select
          value={editor?.getAttributes('textStyle').fontSize?.replace('px', '') || '16'}
          onChange={(e) => {
            editor?.chain()
              .focus()
              .setMark('textStyle', { fontSize: `${e.target.value}px` })
              .run();
          }}
          className="h-8 px-2 rounded border border-gray-200 focus:outline-none text-sm"
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>
    </BubbleMenu>
  )
}
