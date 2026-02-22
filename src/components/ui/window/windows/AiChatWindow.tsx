/**
 * AI 채팅 전용 윈도우
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, AlertCircle, Loader2, Trash2, Zap } from 'lucide-react'
import { sendChatMessageDirect, type ChatRequest, type ChatResponse } from '@/lib/ai/client-actions'
import { useWindowManager } from '../WindowContext'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface TokenUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

interface AiChatWindowContentProps {
  onInsertText?: (text: string) => void
  initialMessage?: string
}

export function AiChatWindowContent({ onInsertText, initialMessage }: AiChatWindowContentProps) {
  const { getWindowData, clearWindowData } = useWindowManager()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState(initialMessage || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4.1-nano')
  const [currentModel, setCurrentModel] = useState<string>('gpt-4.1-nano')
  const [maxTokens, setMaxTokens] = useState<number>(300)
  const [totalTokensUsed, setTotalTokensUsed] = useState<number>(0)
  const [lastUsage, setLastUsage] = useState<TokenUsage | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 사용 가능한 모델 목록
  const availableModels = [
    // GPT-4.1 시리즈 (기존 방식)
    { id: 'gpt-4.1', name: 'GPT-4.1', description: '스마트한 비추론 모델 ($2/$8)', category: 'gpt4' },
    { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', description: '균형잡힌 성능 ($0.40/$1.60)', category: 'gpt4' },
    { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', description: '초저비용 ($0.10/$0.40)', category: 'gpt4' },
    
    // GPT-5.2 자동 라우팅
    { id: 'gpt-5.2', name: 'GPT-5.2', description: '코딩 및 에이전트 작업에 최적 ($1.25/$10)', category: 'gpt5' },
    { id: 'gpt-5.2-mini', name: 'GPT-5.2 Mini', description: '빠르고 비용 효율적 ($0.25/$2)', category: 'gpt5' },
    { id: 'gpt-5.2-nano', name: 'GPT-5.2 Nano', description: '가장 빠르고 저렴 ($0.05/$0.40)', category: 'gpt5' },
  ]

  // 메시지 스크롤 자동 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
    
    // windowData에서 선택된 텍스트 가져오기
    const windowData = getWindowData('ai-chat-window')
    if (windowData?.selectedText) {
      setInputValue(windowData.selectedText)
      // 데이터 사용 후 클리어
      clearWindowData('ai-chat-window')
    } else if (initialMessage) {
      // windowData가 없으면 initialMessage 사용
      setInputValue(initialMessage)
    }
  }, [initialMessage, getWindowData, clearWindowData])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue.trim()
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      const chatRequest: ChatRequest = {
        message: currentInput,
        model: selectedModel,
        max_tokens: maxTokens,
        temperature: 0.7,
      }

      const response = await sendChatMessageDirect(chatRequest)

      // 토큰 사용량 업데이트
      if (response.usage) {
        setLastUsage(response.usage)
        setTotalTokensUsed(prev => prev + response.usage!.total_tokens)
      }
      
      // 모델 정보 업데이트
      if (response.model) {
        setCurrentModel(response.model)
      }

      const assistantMessage: ChatMessage = {
        id: response.id || `ai-${Date.now()}`,
        role: 'assistant',
        content: response.message || '응답을 받지 못했습니다.',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : '메시지 전송에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInsertToEditor = (text: string) => {
    if (onInsertText) {
      onInsertText(text)
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
    setTotalTokensUsed(0)
    setLastUsage(null)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50/80">
      {/* 헤더 영역 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <Bot className="text-white" size={14} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">AI 어시스턴트</h3>
              <p className="text-xs text-gray-500">{currentModel}</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-2.5 py-1.5 text-xs bg-gray-200/60 hover:bg-gray-300/60 rounded-md text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={12} />
              <span>지우기</span>
            </button>
          )}
        </div>

        {/* 모델 선택 */}
        <div className="mb-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <optgroup label="🔷 GPT-4.1 시리즈">
              {availableModels.filter(m => m.category === 'gpt4').map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
            </optgroup>
            <optgroup label="⚡ GPT-5 시리즈">
              {availableModels.filter(m => m.category === 'gpt5').map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* 최대 토큰 설정 */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-gray-600">최대 토큰</label>
            <span className="text-xs font-mono text-blue-600">{maxTokens}</span>
          </div>
          <input
            type="range"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            min="100"
            max="1000"
            step="50"
            disabled={isLoading}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>100</span>
            <span>500</span>
            <span>1000</span>
          </div>
        </div>
        
        {/* 토큰 사용량 표시 */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Zap size={12} className="text-yellow-500" />
            <span className="font-medium">총 사용:</span>
            <span className="font-mono text-blue-600">{totalTokensUsed.toLocaleString()}</span>
            <span className="text-gray-500">토큰</span>
          </div>
          
          {lastUsage && (
            <div className="flex items-center gap-3 text-gray-500 border-l border-gray-300 pl-4">
              <div className="flex items-center gap-1">
                <span>입력:</span>
                <span className="font-mono text-gray-700">{lastUsage.prompt_tokens}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>출력:</span>
                <span className="font-mono text-gray-700">{lastUsage.completion_tokens}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/80">
        {messages.length === 0 && !isLoading && (
          <div className="text-center mt-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Bot size={32} className="text-blue-600" />
            </div>
            <p className="text-base text-gray-700 mb-1">AI와 채팅하며</p>
            <p className="text-sm text-gray-500">글을 작성해보세요!</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className="text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[75%] rounded-xl p-3 shadow-sm ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                  : 'bg-white/90 text-gray-800 border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              
              {/* AI 응답에 에디터 삽입 버튼 추가 */}
              {message.role === 'assistant' && onInsertText && (
                <button
                  onClick={() => handleInsertToEditor(message.content)}
                  className="mt-3 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  에디터에 삽입
                </button>
              )}
            </div>

            {message.role === 'user' && (
              <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={14} className="text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-white/90 rounded-xl p-3 flex items-center gap-2 border border-gray-200 shadow-sm">
              <Loader2 size={14} className="animate-spin text-blue-600" />
              <span className="text-gray-700 text-sm">응답 생성중...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
          <AlertCircle size={14} className="text-red-600" />
          <span className="text-red-700 text-xs">{error}</span>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="p-4 border-t border-gray-200 bg-white/60">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="AI에게 질문하세요..."
            className="flex-1 px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            <span className="text-sm font-medium">전송</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Enter로 전송 • AI와 채팅하며 글을 작성하세요
        </p>
      </div>
    </div>
  )
}

// 기본 아이콘
export const AiChatWindowIcon = () => <Bot size={14} />

