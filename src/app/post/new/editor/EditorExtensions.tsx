'use client'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle as TextStyleExtension } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import CodeBlock from '@tiptap/extension-code-block'
import FontSize from '@tiptap/extension-font-size'
import FontFamily from '@tiptap/extension-font-family'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Highlight from '@tiptap/extension-highlight'
import { createLowlight } from 'lowlight'
import js from 'highlight.js/lib/languages/javascript'
import java from 'highlight.js/lib/languages/java'
import python from 'highlight.js/lib/languages/python'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import kotlin from 'highlight.js/lib/languages/kotlin'
import 'highlight.js/styles/vs2015.css'

const lowlight = createLowlight()
lowlight.register('js', js)
lowlight.register('javascript', js)
lowlight.register('typescript', typescript)
lowlight.register('html', xml)
lowlight.register('xml', xml)
lowlight.register('css', css)
lowlight.register('python', python)
lowlight.register('java', java)
lowlight.register('kotlin', kotlin)
lowlight.register('python', python)

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
  FontSize.configure({
    types: ['textStyle']
  }),
  FontFamily,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  CodeBlock.configure({
    languageClassPrefix: 'language-',
    HTMLAttributes: {
      class: 'hljs',
    },
  }),
  CodeBlockLowlight.configure({
    lowlight,
    HTMLAttributes: {
      class: 'hljs',
    },
  }),
]