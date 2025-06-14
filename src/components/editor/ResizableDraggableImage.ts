import { Node, mergeAttributes } from '@tiptap/core'

export interface ResizableDraggableImageOptions {
  HTMLAttributes: Record<string, any>
}

export const ResizableDraggableImage = Node.create<ResizableDraggableImageOptions>({
  name: 'resizableDraggableImage',
  group: 'inline',
  inline: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: 'auto',
        parseHTML: element => element.getAttribute('width') || 'auto',
        renderHTML: attributes => attributes.width ? { width: attributes.width } : {},
      },
      height: {
        default: 'auto',
        parseHTML: element => element.getAttribute('height') || 'auto',
        renderHTML: attributes => attributes.height ? { height: attributes.height } : {},
      },
      class: {
        default: 'float-none',
        parseHTML: element => element.getAttribute('class') || 'float-none',
        renderHTML: attributes => attributes.class ? { class: attributes.class } : {},
      },
      'data-local': {
        default: null,
        parseHTML: element => element.getAttribute('data-local'),
        renderHTML: attributes => attributes['data-local'] ? { 'data-local': attributes['data-local'] } : {},
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      {},
      ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        src: node.attrs.src,
        width: node.attrs.width,
        height: node.attrs.height,
        class: node.attrs.class,
      })],
    ]
  },

  addCommands() {
    return {
      setResizableDraggableImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const wrapper = document.createElement('span')
      wrapper.style.position = 'relative'
      wrapper.style.display = 'inline-block'

      const img = document.createElement('img')
      img.src = node.attrs.src
      img.style.width = node.attrs.width || 'auto'
      img.style.height = node.attrs.height || 'auto'
      img.className = node.attrs.class || 'float-none'
      img.draggable = true
      wrapper.appendChild(img)

      if (!editor.isEditable) {
        return {
          dom: wrapper,
          contentDOM: null,
        }
      }

      const createHandle = (cursor: string, xMul: number, yMul: number): HTMLSpanElement => {
        const handle = document.createElement('span')
        handle.contentEditable = 'false'
        handle.style.position = 'absolute'
        handle.style.width = '12px'
        handle.style.height = '12px'
        handle.style.background = '#aaa'
        handle.style.cursor = cursor
        handle.style.borderRadius = '50%'
        handle.style.zIndex = '10'
        handle.style.userSelect = 'none'
        handle.style.boxShadow = '0 0 2px #333'
        handle.style.left = xMul === -1 ? '-6px' : xMul === 1 ? 'calc(100% - 6px)' : '50%'
        handle.style.top = yMul === -1 ? '-6px' : yMul === 1 ? 'calc(100% - 6px)' : '50%'
        handle.style.transform = `translate(${xMul === 0 ? '-50%' : '0'}, ${yMul === 0 ? '-50%' : '0'})`
        return handle
      }
      const handles = [
        createHandle('nwse-resize', -1, -1),
        createHandle('nesw-resize', 1, -1),
        createHandle('nesw-resize', -1, 1),
        createHandle('nwse-resize', 1, 1),
      ]
      handles.forEach(h => wrapper.appendChild(h))

      let startX = 0, startY = 0, startWidth = 0, startHeight = 0
      handles.forEach((handle, idx) => {
        const xMul = idx === 0 || idx === 2 ? -1 : 1
        const yMul = idx === 0 || idx === 1 ? -1 : 1
        handle.addEventListener('mousedown', (event) => {
          event.preventDefault()
          startX = event.clientX
          startY = event.clientY
          startWidth = img.offsetWidth
          startHeight = img.offsetHeight

          const onMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = Math.max(30, startWidth + xMul * (moveEvent.clientX - startX))
            const newHeight = Math.max(30, startHeight + yMul * (moveEvent.clientY - startY))
            img.style.width = `${newWidth}px`
            img.style.height = `${newHeight}px`
          }

          const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
            const pos = getPos!() as number
            const transaction = editor.state.tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              width: img.style.width,
              height: img.style.height,
            })
            editor.view.dispatch(transaction)
          }

          document.addEventListener('mousemove', onMouseMove)
          document.addEventListener('mouseup', onMouseUp)
        })
      })

      return {
        dom: wrapper,
        contentDOM: null,
      }
    }
  },
})
