'use client'
import { useEditorContext } from './EditorContext'
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Palette, Code, List, ListOrdered, Table, Quote, 
  Image, Smile, Video
} from 'lucide-react'
import { useEffect, useState } from 'react'
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react'
import { koreanFonts } from '@/app/fonts/editor/kr';
import { englishFonts } from '@/app/fonts/editor/en';
import { codeFonts } from '@/app/fonts/editor/co';
import { FaYoutube } from 'react-icons/fa'
const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '40'];

const CODE_LANGUAGE = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' }
];

const FONTS_BY_LANGUAGE = {
  ko: koreanFonts,
  en: englishFonts,
  co: codeFonts,
};

export function EditorMenuBar() {
  const editor = useEditorContext();
  const [fontSize, setFontSize] = useState('12');
  const [preset, setPreset] = useState('normal');
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false
  });
  const [tableSize, setTableSize] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputLanguage, setInputLanguage] = useState<'ko' | 'en' | 'co' >('en');
  const [selectedFont, setSelectedFont] = useState('ko');

  useEffect(() => {
    if (!editor) return;
    
    editor.commands.updateAttributes('textStyle', {
      fontSize: `${fontSize}px`
    });
      
    editor.chain()
      .focus()
      .setFontSize(`${fontSize}px`)
      .run();
  }, [fontSize, editor]);

  useEffect(() => {
    if (!editor) return;
  
    if (editor.isActive('textStyle')) {
      editor.chain()
        .focus()
        .setFontFamily(selectedFont)
        .run();
    }
  }, [selectedFont, editor]);

  const handlePresetChange = (value: string) => {
    const newSize = 
        value === 'h1' ? '40'
      : value === 'h2' ? '24'
      : value === 'h3' ? '20'
      : value === 'p1' ? '16'
      : value === 'p2' ? '14'
      : '12';  // p3의 경우

    setPreset(value);
    setFontSize(newSize);

    // h1, h2, h3일 경우 bold 처리
    if (value.startsWith('h')) {
      editor?.chain()
        .setMark('textStyle', { fontSize: `${newSize}px`, fontWeight: 'bold' })
        .run();
    } else {
      editor?.chain()
        .setMark('textStyle', { fontSize: `${newSize}px`, fontWeight: 'normal' })
        .run();
    }
  };

  useEffect(() => {
    if (!editor) return;

    const updateActiveStates = () => {
      setActiveStates({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strike: editor.isActive('strike')
      });
    };

    editor.on('transaction', updateActiveStates);
    editor.on('selectionUpdate', updateActiveStates);

    return () => {
      editor.off('transaction', updateActiveStates);
      editor.off('selectionUpdate', updateActiveStates);
    };
  }, [activeStates]);
  useEffect(() => {
    const handleComposition = (e: CompositionEvent) => {
      if (e.data) setInputLanguage('ko');
    };

    const handleInput = (e: Event) => {
      if (editor?.isActive('codeBlock')) {
        setInputLanguage('co');
      }
      else if (e instanceof InputEvent && e.data && /[a-zA-Z]/.test(e.data)) {
        setInputLanguage('en');
      }
    };

    document.addEventListener('compositionupdate', handleComposition);
    document.addEventListener('input', handleInput);
    
    return () => {
      document.removeEventListener('compositionupdate', handleComposition);
      document.removeEventListener('input', handleInput);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border-b border-gray-200 p-2 space-y-2">
      {/* 스타일 버튼들 */}
      <div className="flex items-center gap-1 p-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            activeStates.bold ? 'bg-gray-100' : ''
          }`}
          title="굵게 (Ctrl+B)"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            activeStates.italic ? 'bg-gray-100' : ''
          }`}
          title="기울임 (Ctrl+I)"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            activeStates.underline ? 'bg-gray-100' : ''
          }`}
          title="밑줄 (Ctrl+U)"
        >
          <Underline size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            activeStates.strike ? 'bg-gray-100' : ''
          }`}
          title="취소선"
        >
          <Strikethrough size={18} />
        </button>

        {/* 정렬 버튼 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''
          }`}
          title="왼쪽 정렬"
        >
          <AlignLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''
          }`}
          title="가운데 정렬"
        >
          <AlignCenter size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''
          }`}
          title="오른쪽 정렬"
        >
          <AlignRight size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-100' : ''
          }`}
          title="양쪽 정렬"
        >
          <AlignJustify size={18} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        {/* 글자 크기 프리셋 */}
        <div className="relative">
          <select
            onChange={(e) => handlePresetChange(e.target.value)}
            className="h-9 px-2 border border-gray-200 focus:outline-none rounded-b [&>option]:p-2"
            value={preset}>
            <option value="h1" style={{ fontSize: '40px', fontWeight: 'bold' }}>제목1</option>
            <option value="h2" style={{ fontSize: '24px', fontWeight: 'bold' }}>제목2</option>
            <option value="h3" style={{ fontSize: '20px', fontWeight: 'bold' }}>제목3</option>
            <option value="p1" style={{ fontSize: '16px' }}>본문1</option>
            <option value="p2" style={{ fontSize: '14px' }}>본문2</option>
            <option value="p3" style={{ fontSize: '12px' }}>본문3</option>
          </select>
        </div>

        {/* 폰트 크기 선택 */}
        <div className="relative">
          <select
            onChange={(e) => setFontSize(e.target.value)}
            className="h-9 px-2 rounded border border-gray-200 focus:outline-none"
            value={fontSize}
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
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="h-9 px-2 rounded border border-gray-200 focus:outline-none"
          >
            {editor.isActive('codeBlock') ? 
            FONTS_BY_LANGUAGE['co'].map(font => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.label}
              </option>
            ))
            :
            FONTS_BY_LANGUAGE[inputLanguage].map(font => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.label}
              </option>
            ))}
          </select>
        </div>
      </div>

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

          {/* 글자색 팔레트 */}
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
        <div className="relative flex items-center gap-1" title="배경색">
          <div className="relative">
            <div className="absolute left-1.5 pointer-events-none">
              <span className="text-xs font-bold bg-yellow-200 px-1">A</span>
            </div>
            <input
              type="color"
              onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
              className="w-9 h-9 p-1 opacity-0 cursor-pointer"
            />
          </div>
          
          {/* 형광펜 팔레트 */}
          <div className="flex gap-0.5">
            {[
              '#ffcdd2', // 연한 빨강
              '#fff9c4', // 연한 노랑
              '#bbdefb', // 연한 파랑
            ].map((color) => (
              <button
                key={color}
                className="w-5 h-5 border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setHighlight({ color }).run()}
              />
            ))}
          </div>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        {/* 코드 블록 */}
        <div className="flex items-center gap-1">
          <button
            type="button"
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
                const preElement = document.querySelector('pre.hljs');
                if (preElement) {
                  preElement.className = `hljs language-${e.target.value} font-${selectedFont}`;
                }
                editor.chain()
                  .focus()
                  .setCodeBlock({ language: e.target.value })
                  .run();
              }}
              className="h-9 px-2 rounded border border-gray-200 focus:outline-none text-sm"
              value={editor.getAttributes('codeBlock').language || 'javascript'}
            >
              {CODE_LANGUAGE.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          )}
        </div>


      {/* 리스트, 표, 인용구 등 */}
      
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            console.log('Before toggle - bulletList active:', editor.isActive('bulletList'))
            console.log('Current HTML:', editor.getHTML())
            editor.chain().focus().toggleBulletList().run()
            console.log('After toggle - bulletList active:', editor.isActive('bulletList'))
            console.log('Updated HTML:', editor.getHTML())
            console.log('Schema:', editor.schema)
          }}
          className={`p-1 hover:bg-gray-100 rounded ${
            editor.isActive('bulletList') ? 'bg-gray-100' : ''
          }`}
          title="글머리 기호"
        >
          <List size={16} />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('orderedList') ? 'bg-gray-100' : ''
          }`}
          title="번호 매기기"
        >
          <ListOrdered size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('blockquote') ? 'bg-gray-100' : ''
          }`}
          title="인용구"
        >
          <Quote size={18} />
        </button>

        <div className="relative group">
          <button
            type="button"
            className="p-2 rounded hover:bg-gray-100"
            title="표 삽입"
          >
            <Table size={18} />
          </button>
          
          {/* 표 크기 선택 그리드 */}
          <div className="absolute hidden w-30 group-hover:block bg-white border rounded-lg p-2 shadow-lg z-50">
            <div className="flex flex-col gap-0">
              {[...Array(5)].map((_, row) => (
                <div key={row} className="flex gap-0">
                  {[...Array(5)].map((_, col) => (
                    <button
                      key={`${row}-${col}`}
                      className="w-[20px] h-[20px] border-t border-l border-gray-300 last:border-r first:border-t [&:nth-child(n)]:border-b"
                      onMouseEnter={(e) => {
                        setTableSize(`${row + 1}x${col + 1}`);
                        const buttons = e.currentTarget.parentElement?.parentElement?.getElementsByTagName('button');
                        if (buttons) {
                          for (let r = 0; r <= row; r++) {
                            for (let c = 0; c <= col; c++) {
                              const index = r * 5 + c;
                              buttons[index].style.backgroundColor = '#93c5fd';
                            }
                          }
                        }
                      }}
                      onMouseLeave={(e) => {
                        setTableSize('');
                        const buttons = e.currentTarget.parentElement?.parentElement?.getElementsByTagName('button');
                        if (buttons) {
                          Array.from(buttons).forEach(button => {
                            button.style.backgroundColor = '';
                          });
                        }
                      }}
                      onClick={() => editor.chain().focus().insertTable({
                        rows: row + 1,
                        cols: col + 1,
                        withHeaderRow: true
                      }).run()}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="text-center text-xs mt-1 h-4 text-gray-500 font-medium">
              {tableSize}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const url = window.prompt('이미지 URL을 입력하세요:')
            if (url) {
              editor.chain().focus().setImage({ src: url }).run()
            }
          }}
          className="p-2 rounded hover:bg-gray-100"
          title="이미지 삽입"
        >
          <Image size={18} />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded hover:bg-gray-100"
            title="이모티콘"
          >
          <span style={{ fontSize: "18px" }}>😀</span>
          </button>
          
          {showEmojiPicker && (
            <div className="absolute top-full left-0 z-50">
              <EmojiPicker
                emojiStyle={EmojiStyle.NATIVE}
                onEmojiClick={(emojiData) => {
                  editor.chain().focus().insertContent(emojiData.emoji).run();
                  setShowEmojiPicker(false);
                }}
              />
            </div>
          )}

        <button
          type="button"
          onClick={() => {
            const url = window.prompt('YouTube URL을 입력하세요:')
            if (url) {
              editor.chain().focus().setYoutubeVideo({
                src: url,
              }).run()
            }
          }}
          className="p-2 rounded hover:bg-gray-100"
          title="YouTube 영상 삽입"
          >
          <FaYoutube size={18} className="text-red-600" />
        </button>
        </div>
      </div>
    </div>  
    </div>
  )
}