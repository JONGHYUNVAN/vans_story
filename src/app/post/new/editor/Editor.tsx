'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import { EditorMenuBar } from './EditorMenuBar'
import { EditorBubbleMenu } from './EditorBubbleMenu'
import { EditorProvider } from './EditorContext'
import { common, createLowlight } from 'lowlight'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import rust from 'highlight.js/lib/languages/rust'
import go from 'highlight.js/lib/languages/go'
import sql from 'highlight.js/lib/languages/sql'
import ruby from 'highlight.js/lib/languages/ruby'
import swift from 'highlight.js/lib/languages/swift'
import kotlin from 'highlight.js/lib/languages/kotlin'
import php from 'highlight.js/lib/languages/php'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import bash from 'highlight.js/lib/languages/bash'
import markdown from 'highlight.js/lib/languages/markdown'
import { EditorExtensions } from './EditorExtensions'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'

interface EditorProps {
  /** 초기 에디터 컨텐츠 */
  initialContent?: string
  /** 에디터 내용이 변경될 때 호출되는 콜백 */
  onChange?: (html: string) => void
  /** 에디터 읽기 전용 모드 */
  readonly?: boolean
}

const lowlight = createLowlight(common)

// 언어 등록
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('python', python)
lowlight.register('java', java)
lowlight.register('cpp', cpp)
lowlight.register('csharp', csharp)
lowlight.register('rust', rust)
lowlight.register('go', go)
lowlight.register('sql', sql)
lowlight.register('ruby', ruby)
lowlight.register('swift', swift)
lowlight.register('kotlin', kotlin)
lowlight.register('php', php)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('json', json)
lowlight.register('yaml', yaml)
lowlight.register('bash', bash)
lowlight.register('markdown', markdown)

/**
 * Tiptap 기반의 리치 텍스트 에디터
 * @component
 */
export function Editor({ initialContent = '', onChange, readonly = false }: EditorProps) {
  const editor = useEditor({
    extensions: [
      ...EditorExtensions,
      Table.configure({
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 50,
        lastColumnResizable: true,
        allowTableNodeSelection: true,
        HTMLAttributes: {
          style: 'margin-left: auto; margin-right: auto;'  // 기본 스타일 설정
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      BulletList,
      ListItem,
    ],
    content: initialContent,
    immediatelyRender: false,
    editable: !readonly,
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
        <div className="prose max-w-none">
          <EditorContent 
            editor={editor} 
            className="min-h-[60vh] border border-gray-200 rounded-lg p-0 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
          />
        </div>
      </div>
    </EditorProvider>
  )
}