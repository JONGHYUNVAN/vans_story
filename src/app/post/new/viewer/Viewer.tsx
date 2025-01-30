'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
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

const lowlight = createLowlight(common)

interface PostViewerProps {
  content: string;
}

export function PostViewer({ content }: PostViewerProps) {
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
    ],
    content,
    editable: false,
    immediatelyRender: false,
  })

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  )
}
