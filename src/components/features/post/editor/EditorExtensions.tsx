'use client';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle as TextStyleExtension, FontSize } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import { lowlight } from '@/lib/lowlight';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import Youtube from '@tiptap/extension-youtube';

import { ResizableDraggableImage } from './ResizableDraggableImage';
import { AiDiffBlock } from './AiDiffBlockExtension';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    uploadImage: {
      uploadImage: (url: string) => ReturnType;
    };
    resizableDraggableImage: {
      setResizableDraggableImage: (options: {
        src: string;
        width?: string;
        height?: string;
        class?: string;
        'data-local'?: string;
      }) => ReturnType;
    };
  }
}

// 커스텀 이미지 확장
const CustomImage = Image.extend({
  name: 'image',
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      'data-local': {
        default: null,
      },
      class: {
        default: 'float-none',
      },
    };
  },
});

export const EditorExtensions = [
  // 기본적인 편집 기능들을 포함하는 확장 모음
  StarterKit.configure({
    codeBlock: false,
    link: false,
    underline: false,
    // 리스트 확장 (StarterKit 내장 BulletList / OrderedList / ListItem 사용)
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
      HTMLAttributes: {
        class: 'list-disc ml-4',
      },
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
      HTMLAttributes: {
        class: 'list-decimal pl-4',
      },
    },
  }),
  // 커스텀 이미지 확장
  CustomImage.configure({
    inline: true,
    allowBase64: true,
    HTMLAttributes: {
      class: 'max-w-full h-auto',
    },
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
  // Table 관련 확장 추가
  Table.configure({
    resizable: true,
    handleWidth: 5,
    cellMinWidth: 50,
    lastColumnResizable: true,
    allowTableNodeSelection: true,
    HTMLAttributes: {
      style: 'margin-left: auto; margin-right: auto;',
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
  ResizableDraggableImage.configure({
    HTMLAttributes: {
      class: 'max-w-full h-auto',
    },
  }),
  // AI Diff Block 확장
  AiDiffBlock,
];
