'use client'
import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'

interface AiInlineDiffProps {
  editor: any
  originalText: string
  suggestedText: string
  selectionRange: { from: number; to: number }
  onAccept: () => void
  onReject: () => void
}

/**
 * Cursor 스타일 인라인 diff - 에디터 본문에 직접 표시
 * @component
 */
export function AiInlineDiff({
  editor,
  originalText,
  suggestedText,
  selectionRange,
  onAccept,
  onReject
}: AiInlineDiffProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (!editor || !selectionRange) return

    // 선택된 영역의 DOM 위치 계산
    const calculatePosition = () => {
      try {
        const { from } = selectionRange
        const coords = editor.view.coordsAtPos(from)
        const editorRect = editor.view.dom.getBoundingClientRect()
        
        setPosition({
          top: coords.top - editorRect.top + editor.view.dom.scrollTop,
          left: coords.left - editorRect.left + 20 // 왼쪽 여백
        })
      } catch (error) {
        console.error('Position calculation error:', error)
      }
    }

    calculatePosition()

    // 키보드 이벤트
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onReject()
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        onAccept()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editor, selectionRange, onAccept, onReject])

  if (!position) return null

  return (
    <div
      className="absolute z-50 bg-white border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxWidth: 'calc(100% - 40px)',
        minWidth: '400px'
      }}
    >
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold">AI 제안</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onAccept}
              className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-xs font-medium transition-colors"
              title="적용 (Ctrl+Enter)"
            >
              <Check size={14} />
              적용
            </button>
            <button
              onClick={onReject}
              className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-xs font-medium transition-colors"
              title="취소 (Esc)"
            >
              <X size={14} />
              취소
            </button>
          </div>
        </div>
      </div>

      {/* Diff 내용 */}
      <div className="max-h-[400px] overflow-y-auto">
        {/* 삭제될 텍스트 (원본) */}
        <div className="bg-red-50 border-b-2 border-red-200 p-3">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              -
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-red-700 font-semibold mb-1">삭제</div>
              <pre className="whitespace-pre-wrap font-sans text-sm text-red-900 bg-red-100/50 p-2 rounded break-words">
                {originalText}
              </pre>
            </div>
          </div>
        </div>

        {/* 추가될 텍스트 (제안) */}
        <div className="bg-green-50 p-3">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              +
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-green-700 font-semibold mb-1">추가</div>
              <pre className="whitespace-pre-wrap font-sans text-sm text-green-900 bg-green-100/50 p-2 rounded break-words">
                {suggestedText}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 힌트 */}
      <div className="bg-gray-50 border-t px-3 py-2 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-3">
          <span>⌨️ Ctrl+Enter: 적용</span>
          <span>Esc: 취소</span>
        </div>
        <div className="text-blue-600 font-medium">
          AI 추천
        </div>
      </div>
    </div>
  )
}

