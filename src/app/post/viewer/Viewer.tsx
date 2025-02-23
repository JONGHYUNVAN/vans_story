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

const lowlight = createLowlight(common)

export function Viewer({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      BulletList,
      OrderedList,
      ListItem,
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Blockquote,
    ],
    content,
    editable: false,
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!editor) return

    // 복사 버튼 추가 함수
    const addCopyButtons = () => {
      const container = editor.view.dom
      
      // 코드 블록
      container.querySelectorAll('pre').forEach(pre => {
        const button = document.createElement('button')
        button.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>'
        button.className = 'absolute top-2 right-2 p-2 bg-gray-700 rounded hover:bg-gray-600'
        button.onclick = () => {
          navigator.clipboard.writeText(pre.textContent || '')
        }
        pre.style.position = 'relative'
        pre.appendChild(button)
      })

      // 인용구
      container.querySelectorAll('blockquote').forEach(quote => {
        const button = document.createElement('button')
        button.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>'
        button.className = 'absolute top-2 right-2 p-2 bg-gray-700 rounded hover:bg-gray-600 opacity-0 transition-opacity group-hover:opacity-100'
        button.onclick = () => {
          navigator.clipboard.writeText(quote.textContent || '')
        }
        quote.style.position = 'relative'
        quote.className += ' group'
        quote.appendChild(button)
      })

      // 표
      container.querySelectorAll('table').forEach(table => {
        const button = document.createElement('button')
        button.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>'
        button.className = 'absolute top-2 right-2 p-2 bg-gray-700 rounded hover:bg-gray-600 opacity-0 transition-opacity group-hover:opacity-100'
        button.onclick = () => {
          const text = Array.from(table.rows).map(row => 
            Array.from(row.cells).map(cell => cell.textContent).join('\t')
          ).join('\n')
          navigator.clipboard.writeText(text)
        }
        const wrapper = document.createElement('div')
        wrapper.style.position = 'relative'
        wrapper.className = 'group'
        table.parentNode?.insertBefore(wrapper, table)
        wrapper.appendChild(table)
        wrapper.appendChild(button)
      })
    }

    // 컨텐츠가 변경될 때마다 복사 버튼 추가
    addCopyButtons()
    return () => {
      // cleanup if needed
    }
  }, [editor])

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  )
}
