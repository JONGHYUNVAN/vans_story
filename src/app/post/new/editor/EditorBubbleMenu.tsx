'use client'
import { BubbleMenu } from '@tiptap/react'
import { Bold, Italic, Underline, Palette, Type } from 'lucide-react'
import { useEditorContext } from './EditorContext'
import { Trash2 } from 'lucide-react'
import { default as insert_up } from '../../../../../public/icons/insert_up.ico'
import { default as insert_down } from '../../../../../public/icons/insert_down.ico'
import { default as insert_left } from '../../../../../public/icons/insert_left.ico'
import { default as insert_right } from '../../../../../public/icons/insert_right.ico'
import { default as remove_row } from '../../../../../public/icons/remove_row.ico'
import { default as remove_column } from '../../../../../public/icons/remove_column.ico'
import { default as merge } from '../../../../../public/icons/merge.ico'
import { default as divide } from '../../../../../public/icons/divide.ico'
import { default as align_left } from '../../../../../public/icons/align_left.ico'
import { default as align_center } from '../../../../../public/icons/align_center.ico'
import { default as align_right } from '../../../../../public/icons/align_right.ico'


const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '40']

/**
 * 텍스트 선택 시 나타나는 버블 메뉴 컴포넌트
 * @component
 */
export function EditorBubbleMenu() {
  const editor = useEditorContext()
  if (!editor) return null

  return (
    <>
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor, state }) => {
          if (!editor || !editor.view || !editor.view.dom) return false
          const { selection } = state
          return !selection.empty
        }}
        className="flex items-center bg-white shadow-lg border rounded-lg overflow-hidden"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 hover:bg-gray-100 transition-colors ${
            editor.isActive('bold') ? 'bg-gray-100' : ''
          }`}
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 hover:bg-gray-100 transition-colors ${
            editor.isActive('italic') ? 'bg-gray-100' : ''
          }`}
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
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

      {/* 표 버블 메뉴 */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive('table')}
        className="flex items-center gap-1 p-1 rounded-lg bg-white border shadow-lg"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className="p-1 hover:bg-gray-100 rounded"
          title="위에 행 추가"
        >
          <img src={insert_up.src} alt="위에 행 추가" width={16} height={16} />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className="p-1 hover:bg-gray-100 rounded"
          title="아래에 행 추가"
        >
          <img src={insert_down.src} alt="아래에 행 추가" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className="p-1 hover:bg-gray-100 rounded"
          title="왼쪽에 열 추가"
        >
          <img src={insert_left.src} alt="왼쪽에 열 추가" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className="p-1 hover:bg-gray-100 rounded"
          title="오른쪽에 열 추가"
        >
          <img src={insert_right.src} alt="오른쪽에 열 추가" width={16} height={16} />
        </button>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteRow().run()}
          className="p-1 hover:bg-gray-100 rounded"
          title="행 삭제"
        >
          <img src={remove_row.src} alt="행 삭제" width={16} height={16} className="text-red-500" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className="p-1 hover:bg-gray-100 rounded"
          title="열 삭제"
        >
          <img src={remove_column.src} alt="열 삭제" width={16} height={16} className="text-red-500" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteTable().run()}
          className="p-1 hover:bg-gray-100 rounded"
          title="표 삭제"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().mergeCells().run()}
          className="p-1 hover:bg-gray-100 rounded"
          title="셀 병합"
        >
          <img src={merge.src} alt="셀 병합" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().splitCell().run()}
          className="p-1 hover:bg-gray-100 rounded"
          title="셀 분할"
        >
          <img src={divide.src} alt="셀 분할" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            const dom = editor.view.dom.querySelector('table')
            if (dom) {
              dom.style.width = dom.style.width || '285px'
              dom.style.marginLeft = '0'
              dom.style.marginRight = 'auto'
            }
          }}
          className={`p-1 hover:bg-gray-100 rounded`}
          title="표 왼쪽 정렬"
        >
          <img src={align_left.src} alt="표 왼쪽 정렬" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            const dom = editor.view.dom.querySelector('table')
            if (dom) {
              dom.style.width = dom.style.width || '285px'
              dom.style.marginLeft = 'auto'
              dom.style.marginRight = 'auto'
            }
          }}
          className={`p-1 hover:bg-gray-100 rounded`}
          title="표 가운데 정렬"
        >
          <img src={align_center.src} alt="표 가운데 정렬" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            const dom = editor.view.dom.querySelector('table')
            if (dom) {
              dom.style.width = dom.style.width || '285px'
              dom.style.marginLeft = 'auto'
              dom.style.marginRight = '0'
            }
          }}
          className={`p-1 hover:bg-gray-100 rounded`}
          title="표 오른쪽 정렬"
        >
          <img src={align_right.src} alt="표 오른쪽 정렬" width={16} height={16} />
        </button>
      </BubbleMenu>
    </>
  )
}
