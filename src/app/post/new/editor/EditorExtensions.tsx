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
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import sql from 'highlight.js/lib/languages/sql';


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
lowlight.register('sql', sql);



export const EditorExtensions = [
  // 기본적인 편집 기능들을 포함하는 확장 모음
  StarterKit.configure({
    codeBlock: false,
    bulletList: false,
    orderedList: false,
  }),
  // 이미지 확장
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  // 링크 확장
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
  // 텍스트 정렬 확장
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  // 밑줄 확장
  Underline,
  // 텍스트 스타일 확장
  TextStyleExtension,
  // 폰트 크기 확장
  FontSize,
  // 폰트 패밀리 확장
  FontFamily,
  // 색상 확장
  Color,
  // 하이라이트 확장
  Highlight.configure({
    multicolor: true,
  }),
  // 코드 블록 확장
  CodeBlock,
  // 코드 블록 확장
  CodeBlockLowlight.configure({
    lowlight, // 하이라이트 설정
  }),
  // 리스트 확장
  BulletList.configure({
    keepMarks: true,
    keepAttributes: false,
    HTMLAttributes: {
      class: 'list-disc ml-4',
    },
  }),
  OrderedList.configure({
    keepMarks: true,
    keepAttributes: false,
    HTMLAttributes: {
      class: 'list-decimal pl-4',
    },
  }),
  ListItem.configure({
    HTMLAttributes: {
      class: 'my-1',
    },
  }),
]