'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import { EditorMenuBar } from './EditorMenuBar'
import { EditorBubbleMenu } from './EditorBubbleMenu'
import { EditorProvider } from './EditorContext'
import { FontSize } from '@tiptap/extension-font-size'
import FontFamily from '@tiptap/extension-font-family'
import { common, createLowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from '@tiptap/starter-kit'
import java from 'highlight.js/lib/languages/java'
import GapCursor from '@tiptap/extension-gapcursor';

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
 * Tiptap 기반의 리치 텍스트 에디터 컴포넌트
 * @component
 */
export function Editor({ initialContent = '', onChange, readonly = false }: EditorProps) {
  const extensions = [
    StarterKit.configure({
      codeBlock: false,
    }),
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: 'javascript',
    }),
    FontSize.configure(),
    FontFamily.configure(),
  ]

  const editor = useEditor({
    extensions: [
      StarterKit,
      GapCursor, 
    ],
    content: initialContent,
    editable: !readonly,
    immediatelyRender: false,
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
        <EditorContent editor={editor} className="prose max-w-none p-4" />
      </div>
    </EditorProvider>
  )
}