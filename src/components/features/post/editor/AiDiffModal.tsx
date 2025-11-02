'use client'
import { useState } from 'react'
import { X, Check } from 'lucide-react'

interface AiDiffModalProps {
  isOpen: boolean
  originalText: string
  suggestedText: string
  onAccept: () => void
  onReject: () => void
}

/**
 * AI 제안을 원본과 비교하여 보여주는 diff 모달
 * @component
 */
export function AiDiffModal({
  isOpen,
  originalText,
  suggestedText,
  onAccept,
  onReject
}: AiDiffModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">AI 제안 검토</h2>
            <p className="text-sm text-gray-600 mt-1">변경 사항을 확인하고 적용 여부를 선택하세요</p>
          </div>
          <button
            onClick={onReject}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Diff 뷰 */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* 원본 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-red-200">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h3 className="font-semibold text-red-700">원본</h3>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 min-h-[200px]">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                  {originalText}
                </pre>
              </div>
            </div>

            {/* 제안 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="font-semibold text-green-700">AI 제안</h3>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 min-h-[200px]">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                  {suggestedText}
                </pre>
              </div>
            </div>
          </div>

          {/* 변경 사항 하이라이트 설명 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 mt-0.5">💡</div>
              <div className="text-sm text-blue-900">
                <strong>검토 팁:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>왼쪽(빨강)은 원본 텍스트입니다</li>
                  <li>오른쪽(초록)은 AI가 제안한 수정본입니다</li>
                  <li>문맥과 의도가 잘 반영되었는지 확인하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onReject}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all active:scale-98"
          >
            취소 (Esc)
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Check size={20} />
            적용하기 (Enter)
          </button>
        </div>
      </div>
    </div>
  )
}

