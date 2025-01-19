'use client'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle as TextStyleExtension } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

import 'highlight.js/styles/atom-one-dark.css'



export const EditorExtensions = [
  StarterKit.configure({
    codeBlock: false, 
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Underline,
  TextStyleExtension,
  Color
]