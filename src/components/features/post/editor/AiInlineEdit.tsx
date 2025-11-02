'use client'
import { useEffect } from 'react'

interface AiInlineEditProps {
  editor: any
  originalText: string
  suggestedText: string
  selectionRange: { from: number; to: number }
  onAccept: () => void
  onReject: () => void
}

/**
 * Cursor 스타일 인라인 편집
 * 에디터 상단에 고정된 버튼
 */
export function AiInlineEdit({
  onAccept,
  onReject
}: AiInlineEditProps) {
  useEffect(() => {
    // 키보드 단축키
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        onReject()
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault()
        onAccept()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onReject()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onAccept, onReject])

  return (
    <div 
      className="fixed top-4 left-1/2 z-[9999] flex items-center gap-2 bg-white shadow-xl rounded-lg px-4 py-2 border-2 border-gray-300"
      style={{
        transform: 'translateX(-50%)',
        pointerEvents: 'auto'
      }}
    >
      {/* Undo 버튼 */}
      <button
        onClick={(e) => {
          console.log('🔴 Undo 버튼 클릭됨')
          e.preventDefault()
          e.stopPropagation()
          onReject()
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors cursor-pointer"
        title="Undo (Ctrl+Z)"
        type="button"
      >
        Undo
      </button>

      {/* Keep 버튼 */}
      <button
        onClick={(e) => {
          console.log('🟢 Keep 버튼 클릭됨')
          e.preventDefault()
          e.stopPropagation()
          onAccept()
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition-colors cursor-pointer"
        title="Keep (Ctrl+Shift+Z)"
        type="button"
      >
        Keep
      </button>
    </div>
  )
}
