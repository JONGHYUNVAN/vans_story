'use client'
import { useState, useEffect } from 'react'
import { X, Sparkles, FileText, BookOpen } from 'lucide-react'
import { sendChatMessage } from '@/lib/ai/client-actions'

interface PostContext {
  title?: string
  mainCategory?: string
  subCategory?: string
  topic?: string
  tags?: string[]
}

interface AiGenerateModalProps {
  isOpen: boolean
  onClose: () => void
  onInsertText: (text: string) => void
  postContext?: PostContext
}

type GenerateMode = 'paragraph' | 'full' | 'outline'

/**
 * AI 문단/글 전체 생성 모달
 * @component
 */
export function AiGenerateModal({ isOpen, onClose, onInsertText, postContext }: AiGenerateModalProps) {
  const [mode, setMode] = useState<GenerateMode>('paragraph')
  // 포스트 컨텍스트의 주제를 기본값으로 사용
  const [topic, setTopic] = useState(postContext?.topic || '')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // 모달이 열릴 때마다 postContext에서 topic 업데이트
  useEffect(() => {
    if (isOpen && postContext?.topic) {
      setTopic(postContext.topic)
    }
  }, [isOpen, postContext?.topic])

  if (!isOpen) return null

  // 컨텍스트 정보 생성
  const getContextInfo = () => {
    if (!postContext) return ''
    
    const parts = []
    if (postContext.title) parts.push(`포스트 제목: ${postContext.title}`)
    if (postContext.mainCategory) parts.push(`메인 카테고리: ${postContext.mainCategory}`)
    if (postContext.subCategory) parts.push(`세부 카테고리: ${postContext.subCategory}`)
    if (postContext.topic) parts.push(`주제: ${postContext.topic}`)
    if (postContext.tags && postContext.tags.length > 0) {
      parts.push(`태그: ${postContext.tags.join(', ')}`)
    }
    
    return parts.length > 0 ? `\n\n포스트 컨텍스트:\n${parts.join('\n')}` : ''
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('주제를 입력해주세요.')
      return
    }

    setIsGenerating(true)

    try {
      const contextInfo = getContextInfo()
      let prompt = ''
      
      switch (mode) {
        case 'paragraph':
          prompt = `다음 주제에 대한 한 문단의 명확하고 정보가 풍부한 설명을 작성해주세요.
주제: ${topic}
${additionalInfo ? `추가 정보: ${additionalInfo}` : ''}${contextInfo}

요구사항:
- 3-5개의 문장으로 구성
- 핵심 개념을 명확하게 설명
- 구체적인 예시 포함
- 전문적이고 읽기 쉬운 문체
- 포스트 컨텍스트를 고려하여 일관성 유지
- **일반 텍스트로만 작성 (마크다운 사용 금지)**`
          break

        case 'full':
          prompt = `다음 주제에 대한 완전한 글을 작성해주세요.
주제: ${topic}
${additionalInfo ? `추가 정보: ${additionalInfo}` : ''}${contextInfo}

요구사항:
- 도입부, 본문, 결론으로 구성
- 각 섹션은 명확하게 구분
- 구체적인 예시와 설명 포함
- 읽기 쉽고 논리적인 흐름
- 포스트 컨텍스트와 카테고리에 맞는 내용
- **일반 텍스트로만 작성 (마크다운 # 헤딩 대신 굵은 텍스트나 빈 줄로 구분)**`
          break

        case 'outline':
          prompt = `다음 주제에 대한 상세한 개요(아웃라인)를 작성해주세요.
주제: ${topic}
${additionalInfo ? `추가 정보: ${additionalInfo}` : ''}${contextInfo}

요구사항:
- 계층적 구조로 작성
- 주요 섹션과 하위 항목 포함
- 각 항목은 간단한 설명과 함께
- 포스트의 전체 맥락을 반영
- **일반 텍스트로만 작성 (마크다운 # 대신 "1.", "2.", "가.", "나." 같은 번호나 들여쓰기 사용)**`
          break
      }

      const response = await sendChatMessage({
        message: prompt,
        model: 'gpt-4o-mini', // 안정적인 모델
        max_tokens: 2000, // 긴 글 생성을 위해 토큰 제한 증가
        temperature: 0.8 // 창의적인 글쓰기
      })

      if (response.message) {
        onInsertText(response.message)
        setTopic('')
        setAdditionalInfo('')
        onClose()
      }
    } catch (error) {
      console.error('AI 생성 오류:', error)
      alert('AI 생성 중 오류가 발생했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  const modes = [
    {
      id: 'paragraph' as const,
      icon: FileText,
      label: '문단 생성',
      desc: '한 문단 작성'
    },
    {
      id: 'full' as const,
      icon: BookOpen,
      label: '글 전체 생성',
      desc: '완전한 글 작성'
    },
    {
      id: 'outline' as const,
      icon: Sparkles,
      label: '아웃라인 생성',
      desc: '개요 작성'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">AI 콘텐츠 생성</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isGenerating}
          >
            <X size={20} />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-6">
          {/* 모드 선택 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              생성 모드 선택
            </label>
            <div className="grid grid-cols-3 gap-3">
              {modes.map((m) => {
                const Icon = m.icon
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      mode === m.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Icon size={24} className="mx-auto mb-2" />
                    <div className="font-semibold text-sm">{m.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{m.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 주제 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              주제 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: React의 useState 훅 사용법"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              disabled={isGenerating}
            />
          </div>

          {/* 추가 정보 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              추가 정보 (선택)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="예: 초보자를 위한 설명, 실전 예제 포함"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              rows={3}
              disabled={isGenerating}
            />
          </div>

          {/* 포스트 컨텍스트 정보 */}
          {postContext && (postContext.title || postContext.mainCategory || postContext.topic) && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-sm text-purple-900">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-600">📋</span>
                  <strong>포스트 정보 (AI가 참고합니다)</strong>
                </div>
                <div className="space-y-1 ml-6 text-purple-700">
                  {postContext.title && <div>• 제목: {postContext.title}</div>}
                  {postContext.mainCategory && <div>• 카테고리: {postContext.mainCategory}</div>}
                  {postContext.subCategory && <div>• 세부: {postContext.subCategory}</div>}
                  {postContext.topic && <div>• 주제: {postContext.topic}</div>}
                  {postContext.tags && postContext.tags.length > 0 && (
                    <div>• 태그: {postContext.tags.join(', ')}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 모드별 설명 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-900">
              <strong>💡 {modes.find((m) => m.id === mode)?.label}</strong>
              <p className="mt-1 text-blue-700">
                {mode === 'paragraph' && '주제에 대한 간결하고 명확한 한 문단을 생성합니다. 핵심 개념을 빠르게 설명할 때 유용합니다.'}
                {mode === 'full' && '도입-본문-결론으로 구성된 완전한 글을 생성합니다. 블로그 포스트나 문서 작성에 적합합니다.'}
                {mode === 'outline' && '주제의 구조화된 개요를 생성합니다. 글을 작성하기 전 구조를 잡을 때 유용합니다.'}
              </p>
            </div>
          </div>

          {/* 생성 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                isGenerating || !topic.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  생성 중...
                </span>
              ) : (
                '생성하기'
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

