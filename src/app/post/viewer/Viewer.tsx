'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect } from 'react'
import { Copy } from 'lucide-react'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Youtube from '@tiptap/extension-youtube'
import TextAlign from '@tiptap/extension-text-align'
import Blockquote from '@tiptap/extension-blockquote'
import java from 'highlight.js/lib/languages/java'

const lowlight = createLowlight(common)
lowlight.register('java', java)

export function Viewer({ content }: { content: string }) {
  // 에디터 없이 직접 HTML을 렌더링합니다
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none [&_pre]:!bg-[#1E1E1E] [&_pre]:!text-white [&_pre]:!rounded-lg [&_pre]:!p-4 [&_pre]:!my-4 [&_pre_code]:!text-sm [&_pre_code]:!font-mono">
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <style jsx global>{`
        .hljs-keyword { color: #569CD6; }
        .hljs-type { color: #4EC9B0; }
        .hljs-string { color: #CE9178; }
        .hljs-number { color: #B5CEA8; }
        .hljs-comment { color: #6A9955; }
        .hljs-class { color: #4EC9B0; }
        .hljs-function { color: #DCDCAA; }
        .hljs-variable { color: #9CDCFE; }
        .hljs-operator { color: #D4D4D4; }
        .hljs-punctuation { color: #D4D4D4; }
      `}</style>
    </div>
  )
}
