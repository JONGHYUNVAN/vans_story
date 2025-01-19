'use client'
import { useEditorContext } from './EditorContext'
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Palette,  Code, 
} from 'lucide-react'


const FONT_SIZES = [
  '12', '14', '16', '18', '20', '24', '28', '32', '36', '40'
]

const CODE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
]

/**
 * 에디터 상단 메뉴바 컴포넌트
 * @component
 */
export function EditorMenuBar() {
  const editor = useEditorContext()
  if (!editor) return null

  return (
    <div className="border-b border-gray-200 p-2 space-y-2">
      {/* 첫 번째 줄 - 기존 기능들 */}
      <div className="flex items-center gap-1 p-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            editor.isActive('bold') ? 'bg-gray-100' : ''
          }`}
          title="굵게 (Ctrl+B)"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            editor.isActive('italic') ? 'bg-gray-100' : ''
          }`}
          title="기울임 (Ctrl+I)"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            editor.isActive('underline') ? 'bg-gray-100' : ''
          }`}
          title="밑줄 (Ctrl+U)"
        >
          <Underline size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            editor.isActive('strike') ? 'bg-gray-100' : ''
          }`}
          title="취소선"
        >
          <Strikethrough size={18} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        {/* 정렬 그룹 */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''
          }`}
          title="왼쪽 정렬"
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''
          }`}
          title="가운데 정렬"
        >
          <AlignCenter size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''
          }`}
          title="오른쪽 정렬"
        >
          <AlignRight size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-100' : ''
          }`}
          title="양쪽 정렬"
        >
          <AlignJustify size={18} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        {/* 글자 크기 선택 */}
        <div className="relative">
          <select
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().setHeading({ level: value as 1 | 2 | 3 | 4 | 5 | 6 }).run();
              }
            }}
            className="h-9 px-2 rounded border border-gray-200 focus:outline-none"
            value={
              editor.isActive('heading', { level: 1 }) ? '1' :
              editor.isActive('heading', { level: 2 }) ? '2' :
              editor.isActive('heading', { level: 3 }) ? '3' : '0'
            }
          >
            <option value="0">본문</option>
            <option value="1">제목 1</option>
            <option value="2">제목 2</option>
            <option value="3">제목 3</option>
          </select>
        </div>

        {/* 폰트 크기 선택 */}
        <div className="relative">
          <select
            value={editor?.getAttributes('textStyle').fontSize?.replace('px', '') || '16'}
            onChange={(e) => {
              editor?.chain()
                .focus()
                .setMark('textStyle', { fontSize: `${e.target.value}px` })
                .run();
            }}
            className="h-9 px-2 rounded border border-gray-200 focus:outline-none"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        {/* 폰트 선택 */}
        <div className="relative">
          <select
            value={editor?.getAttributes('textStyle').fontFamily || 'Inter'}
            onChange={(e) => {
              editor?.chain().focus().setFontFamily(e.target.value).run();
            }}
            className="h-9 px-2 rounded border border-gray-200 focus:outline-none"
          >
            <option value="Inter">Inter</option>
            <option value="Noto Sans KR">Noto Sans KR</option>
            <option value="Roboto Mono">Roboto Mono</option>
            <option value="Gamja Flower">Gamja Flower</option>
          </select>
        </div>
      </div>

      {/* 두 번째 줄 - 새로운 기능들 */}
      <div className="flex items-center gap-1 p-1">
        {/* 글자색 */}
        <div className="relative flex items-center gap-1" title="글자색">
          <div className="relative">
            <div className="absolute left-1.5 pointer-events-none">
              <span className="text-xs font-bold">A</span>
              <Palette size={14} className="text-gray-500" />
            </div>
            <input
              type="color"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              className="w-9 h-9 p-1 opacity-0 cursor-pointer"
            />
          </div>
          {/* 색상 팔레트 */}
          <div className="grid grid-cols-7 gap-0.5">
            {[
              '#ffffff', '#fca5a5', '#fdba74', '#fde047', '#86efac', '#93c5fd', '#d8b4fe',
              '#000000', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#9333ea',
            ].map((color) => (
              <button
                key={color}
                className="w-5 h-5 border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setColor(color).run()}
              />
            ))}
          </div>
        </div>

        {/* 배경색 */}
        <div className="relative flex items-center" title="배경색">
          <div className="absolute left-1.5 pointer-events-none">
            <span className="text-xs font-bold bg-yellow-200 px-1">A</span>
          </div>
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
            className="w-9 h-9 p-1 opacity-0 cursor-pointer"
          />
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        {/* 코드 블록 */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('codeBlock') ? 'bg-gray-100' : ''
            }`}
            title="코드 블록"
          >
            <Code size={18} />
          </button>
          
          {editor.isActive('codeBlock') && (
            <select
              onChange={(e) => {
                editor.chain().focus().setCodeBlock({ language: e.target.value }).run()
              }}
              className="h-9 px-2 rounded border border-gray-200 focus:outline-none text-sm"
              value={editor.getAttributes('codeBlock').language || 'javascript'}
            >
              {CODE_LANGUAGES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  )
}