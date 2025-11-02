'use client'
import { useEffect } from 'react'

interface AiInlineActionBarProps {
  editor: any
  originalText: string
  suggestedText: string
  selectionRange: { from: number; to: number }
  onAccept: () => void
  onReject: () => void
}

/**
 * Cursor 스타일 인라인 액션 바 - 에디터 하단에 표시
 * @component
 */
export function AiInlineActionBar({
  editor,
  originalText,
  suggestedText,
  selectionRange,
  onAccept,
  onReject
}: AiInlineActionBarProps) {

  useEffect(() => {
    // 키보드 단축키
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        onReject()
      }
      // Keep: Ctrl+Shift+Z or Cmd+Shift+Z
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault()
        onAccept()
      }
      // Esc
      else if (e.key === 'Escape') {
        e.preventDefault()
        onReject()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onAccept, onReject])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl px-4 py-2.5 flex items-center gap-4">
        {/* Undo 버튼 */}
        <button
          onClick={onReject}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 rounded transition-colors"
          title="원래대로 되돌리기 (Ctrl+Z)"
        >
          <span className="text-white text-sm font-medium">Undo</span>
          <span className="text-gray-400 text-xs">ctrl+z</span>
        </button>

        <div className="w-px h-5 bg-gray-700" />

        {/* Keep 버튼 */}
        <button
          onClick={onAccept}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded transition-colors"
          title="AI 제안 적용 (Ctrl+Shift+Z)"
        >
          <span className="text-white text-sm font-medium">Keep</span>
          <span className="text-green-200 text-xs">ctrl+shift+z</span>
        </button>
      </div>
    </div>
  )
}

