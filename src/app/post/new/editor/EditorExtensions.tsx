import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import FontSize from '@tiptap/extension-font-size'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { lowlight } from 'lowlight/lib/core'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

const CODE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
]

// 사용할 언어들 등록
CODE_LANGUAGES.forEach(({ value }) => {
  const language = hljs.getLanguage(value);
  if (language) {
    lowlight.registerLanguage(value, () => language);
  }
});

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
  FontFamily.configure({
    types: ['textStyle'],
  }),
  FontSize.configure({
    types: ['textStyle'],
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Underline,
  TextStyle,
  Color,
  CodeBlockLowlight.configure({
    lowlight,
    HTMLAttributes: {
      class: 'rounded-md bg-gray-800 p-4 text-white font-mono',
    },
  }),
]