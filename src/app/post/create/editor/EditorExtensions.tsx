import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

/**
 * Tiptap 에디터에서 사용할 확장 기능들을 정의
 * @constant
 */
export const EditorExtensions = [
  // 기본 에디터 기능 모음 (제목, 굵게, 기울임, 링크 등)
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  // 이미지 확장 기능
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  // 링크 확장 기능
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
]
