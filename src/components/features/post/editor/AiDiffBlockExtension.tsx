'use client'
import { Node, mergeAttributes } from '@tiptap/core'

export const AiDiffBlock = Node.create({
  name: 'aiDiffBlock',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      type: {
        default: 'original', // 'original' | 'suggested'
      },
      text: {
        default: '',
      },
      showButtons: {
        default: false,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-ai-diff-type]',
        getAttrs: (node) => {
          if (typeof node === 'string') return false
          const element = node as HTMLElement
          return {
            type: element.getAttribute('data-ai-diff-type'),
            text: element.textContent?.replace(/UndoKeep/g, '').trim() || '',
            showButtons: element.getAttribute('data-show-buttons') === 'true',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const isOriginal = HTMLAttributes.type === 'original'
    const isSuggested = HTMLAttributes.type === 'suggested'
    const showButtons = HTMLAttributes.showButtons
    
    const bgColor = isOriginal ? '#fee2e2' : '#bbf7d0'
    const textColor = isOriginal ? '#991b1b' : '#065f46'
    
    // 자식 요소들
    const children: any[] = [
      ['span', {}, HTMLAttributes.text || '']
    ]
    
    if (isSuggested && showButtons) {
      children.push(
        [
          'div',
          { 
            style: 'position: absolute; bottom: 4px; right: 8px; display: flex; gap: 4px;',
            contenteditable: 'false'
          },
          [
            'button',
            {
              'data-ai-action': 'undo',
              type: 'button',
              contenteditable: 'false',
              style: 'padding: 4px 12px; background: #374151; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;',
            },
            'Undo',
          ],
          [
            'button',
            {
              'data-ai-action': 'keep',
              type: 'button',
              contenteditable: 'false',
              style: 'padding: 4px 12px; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;',
            },
            'Keep',
          ],
        ]
      )
    }
    
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-ai-diff-type': HTMLAttributes.type,
        'data-show-buttons': showButtons ? 'true' : 'false',
        contenteditable: 'false',
        style: `background-color: ${bgColor}; color: ${textColor}; padding: 4px 8px 36px 8px; margin: 2px 0; display: block; width: 100%; position: relative;`,
      }),
      ...children,
    ]
  },
})

