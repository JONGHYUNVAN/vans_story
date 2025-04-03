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
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import rust from 'highlight.js/lib/languages/rust'
import go from 'highlight.js/lib/languages/go'
import ruby from 'highlight.js/lib/languages/ruby'
import swift from 'highlight.js/lib/languages/swift'
import php from 'highlight.js/lib/languages/php'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import bash from 'highlight.js/lib/languages/bash'
import markdown from 'highlight.js/lib/languages/markdown'
import Youtube from '@tiptap/extension-youtube'


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
lowlight.register('cpp', cpp)
lowlight.register('csharp', csharp)
lowlight.register('rust', rust)
lowlight.register('go', go)
lowlight.register('ruby', ruby)
lowlight.register('swift', swift)
lowlight.register('php', php)
lowlight.register('json', json)
lowlight.register('yaml', yaml)
lowlight.register('bash', bash)
lowlight.register('markdown', markdown)


export const EditorExtensions = [
  // 기본적인 편집 기능들을 포함하는 확장 모음
  StarterKit.configure({
    codeBlock: false,
    bulletList: false,
    orderedList: false,
    link: false,
    underline: false,
    listItem: false,
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
  FontSize.configure({
    types: ['textStyle'],
  }),
  // 폰트 패밀리 확장
  FontFamily.configure({
    types: ['textStyle'],
  }),
  // 색상 확장
  Color,
  // 하이라이트 확장
  Highlight.configure({
    multicolor: true,
  }),
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
  ListItem,
  // Table 관련 확장 추가
  Table.configure({
    resizable: true,
    handleWidth: 5,
    cellMinWidth: 50,
    lastColumnResizable: true,
    allowTableNodeSelection: true,
    HTMLAttributes: {
      style: 'margin-left: auto; margin-right: auto;'
    },
  }),
  TableRow,
  TableCell,
  TableHeader,
  // YouTube 확장 추가
  Youtube.configure({
    HTMLAttributes: {
      class: 'w-full aspect-video',
    },
  }),
]