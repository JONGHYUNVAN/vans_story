'use client'

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Bot, User, AlertCircle, Loader2, Move, GripHorizontal } from 'lucide-react';
import { sendChatMessage } from '@/app/api/ai/actions/client';
import type { ChatRequest } from '@/app/api/ai/actions/client';

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertText?: (text: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AiChatModal({ isOpen, onClose, onInsertText }: AiChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 드래그 관련 상태
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // 크기 조절 관련 상태
  const [size, setSize] = useState({ width: 384, height: 500 }); // w-96 = 384px
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // 메시지 스크롤 자동 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 모달이 열릴 때 입력창에 포커스 및 위치 초기화, 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 모달을 화면 중앙으로 초기화
      setPosition({ x: 0, y: 0 });
      if (inputRef.current) {
        inputRef.current.focus();
      }
      
      // 배경 페이지 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      // 모달이 닫힐 때 스크롤 복원
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // 크기 조절 시작
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  // 드래그 및 크기 조절 중
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // 화면 경계 제한 제거 - 자유롭게 이동 가능
        setPosition({
          x: newX,
          y: newY,
        });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        const newWidth = Math.max(300, resizeStart.width + deltaX); // 최소 너비 300px
        const newHeight = Math.max(200, resizeStart.height + deltaY); // 최소 높이 200px

        setSize({
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const systemMessage = `You're a Korean technical blog assistant. 
1. Each post has: 1-sentence topic intro, 1-paragraph summary, numbered chapters. (1000+ chars each)
2. Write in formal explanatory tone (~입니다). 
3. Use clear structure.
4. never use **. 
5. Include SQL/ERD/code blocks and tables when useful. Explain from a data modeler's view.
6. max 2000 chars, end with summary`;

      const chatRequest: ChatRequest = {
        message: `${systemMessage}\n\n사용자 요청: ${currentInput}`,
        model: 'gpt-4o-mini',
        max_tokens: 2000,
        temperature: 0.7,
      };

      const response = await sendChatMessage(chatRequest);

      const assistantMessage: ChatMessage = {
        id: response.id || `ai-${Date.now()}`,
        role: 'assistant',
        content: response.message || '응답을 받지 못했습니다.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '메시지 전송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
    }
  };

  const handleInsertToEditor = (text: string) => {
    if (onInsertText) {
      onInsertText(text);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      ref={modalRef}
      className="fixed bg-white rounded-lg shadow-2xl flex flex-col border-2 border-gray-200 relative"
      style={{
        top: '80px',
        right: '24px',
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default',
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 9999, // 매우 높은 z-index로 설정
      }}
      onKeyDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* 드래그 가능한 헤더 */}
      <div 
        className="flex items-center justify-between p-3 border-b border-gray-200 cursor-grab active:cursor-grabbing select-none bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Bot className="text-white" size={18} />
          <h2 className="text-sm font-semibold">AI 어시스턴트</h2>
          <Move size={14} className="text-blue-200 ml-1" />
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-2 py-1 text-xs bg-blue-400 hover:bg-blue-300 rounded text-white transition-colors"
              onMouseDown={(e) => e.stopPropagation()}
            >
              지우기
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-400 rounded transition-colors"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 mt-8">
            <Bot size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm mb-1">AI와 채팅하며</p>
            <p className="text-xs text-gray-400">글을 작성해보세요!</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={12} className="text-blue-600" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] rounded-lg p-2 text-sm ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap text-xs leading-relaxed">{message.content}</p>
              <div className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              
              {/* AI 응답에 에디터 삽입 버튼 추가 */}
              {message.role === 'assistant' && onInsertText && (
                <button
                  onClick={() => handleInsertToEditor(message.content)}
                  className="mt-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  삽입
                </button>
              )}
            </div>

            {message.role === 'user' && (
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User size={12} className="text-green-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={12} className="text-blue-600" />
            </div>
            <div className="bg-white rounded-lg p-2 flex items-center gap-2 border border-gray-200">
              <Loader2 size={12} className="animate-spin text-gray-600" />
              <span className="text-gray-600 text-xs">응답 생성중...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mx-3 mb-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle size={12} className="text-red-600" />
          <span className="text-red-700 text-xs">{error}</span>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="AI에게 질문하세요..."
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            {isLoading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Send size={12} />
            )}
            <span className="text-xs">전송</span>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          드래그로 이동 가능 | AI와 채팅하며 글 작성하세요
        </p>
      </div>

      {/* 크기 조절 핸들 */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-gray-300 hover:bg-gray-400 transition-colors"
        style={{
          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
        }}
        onMouseDown={handleResizeMouseDown}
        title="드래그하여 크기 조절"
      >
        <div className="absolute bottom-1 right-1">
          <GripHorizontal size={8} className="text-gray-600 rotate-45" />
        </div>
      </div>
    </div>
  );

  // 포털을 사용하여 document.body에 직접 렌더링
  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
} 