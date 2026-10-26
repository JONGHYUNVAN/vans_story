'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MdClose } from 'react-icons/md';
import MermaidDiagram from './MermaidDiagram';

interface MarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  filePath: string;
}

export default function MarkdownModal({ isOpen, onClose, title, filePath }: MarkdownModalProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 헤딩 텍스트에서 앵커 링크 id 생성
  const generateId = (text: string) => {
    if (typeof text !== 'string') return '';
    // 이모지와 특수문자 제거, 한글과 영어, 숫자만 남기기
    return text
      .replace(
        /[^\u{AC00}-\u{D7AF}\u{1100}-\u{11FF}\u{3130}-\u{318F}\u{A960}-\u{A97F}\u{D7B0}-\u{D7FF}a-zA-Z0-9\s]/gu,
        '',
      )
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  };

  useEffect(() => {
    if (isOpen && filePath) {
      // HTML 파일이 아닌 경우에만 fetch
      if (!filePath.endsWith('.html')) {
        fetchMarkdownContent();
      }
    }
  }, [isOpen, filePath]);

  const fetchMarkdownContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      setContent(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // HTML 파일인지 확인
  const isHtmlFile = filePath.endsWith('.html');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      {/* 모달 컨테이너 */}
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-7xl flex-col rounded-lg bg-white shadow-2xl sm:mx-6 lg:mx-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <MdClose className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-auto p-6" ref={scrollContainerRef}>
          {loading && (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="py-8 text-center text-red-600">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {((content && !loading && !error) || (isHtmlFile && !loading && !error)) && (
            <>
              {isHtmlFile ? (
                <iframe
                  src={filePath}
                  className="h-[calc(90vh-200px)] w-full rounded-lg border-0"
                  title={title}
                />
              ) : (
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // 코드 블록 스타일링
                      pre: ({ children }) => (
                        <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4">{children}</pre>
                      ),
                      code: ({ children, className, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        const isInline = !className;

                        // Mermaid 코드 블록 처리
                        if (language === 'mermaid' && !isInline) {
                          return (
                            <MermaidDiagram
                              chart={String(children).replace(/\n$/, '')}
                              className="my-4"
                            />
                          );
                        }

                        // 일반 코드 블록 처리
                        return (
                          <code
                            className={
                              isInline
                                ? 'rounded bg-gray-200 px-1 py-0.5 text-sm'
                                : 'block overflow-x-auto rounded bg-gray-100 px-3 py-2'
                            }
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      // 테이블 스타일링 (GFM 지원)
                      table: ({ children }) => (
                        <div className="my-4 overflow-x-auto">
                          <table className="min-w-full border-collapse border border-gray-300">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                      tbody: ({ children }) => <tbody className="bg-white">{children}</tbody>,
                      tr: ({ children }) => (
                        <tr className="border-b border-gray-200">{children}</tr>
                      ),
                      th: ({ children }) => (
                        <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-gray-300 px-4 py-2">{children}</td>
                      ),
                      // 링크 스타일링
                      a: ({ children, href }) => {
                        // 앵커 링크(#로 시작)는 모달 내에서 스크롤
                        if (href?.startsWith('#')) {
                          return (
                            <a
                              href={href}
                              className="cursor-pointer text-blue-600 underline hover:text-blue-800"
                              onClick={(e) => {
                                e.preventDefault();
                                try {
                                  const targetId = decodeURIComponent(href.substring(1));
                                  // 모든 요소를 검색하여 id가 일치하는 요소를 찾기
                                  const elements =
                                    scrollContainerRef.current?.querySelectorAll('[id]');
                                  const element = Array.from(elements || []).find(
                                    (el) => el.id === targetId,
                                  );
                                  if (element && scrollContainerRef.current) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }
                                } catch (error) {
                                  console.error('Error navigating to anchor:', error);
                                }
                              }}
                            >
                              {children}
                            </a>
                          );
                        }
                        // 외부 링크는 새 창으로 열기
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            {children}
                          </a>
                        );
                      },
                      // 헤딩 스타일링
                      h1: ({ children }) => {
                        const text = Array.isArray(children)
                          ? children.join('')
                          : children?.toString() || '';
                        const id = generateId(text);
                        return (
                          <h1
                            id={id}
                            className="mb-6 mt-12 border-t-4 border-blue-500 pt-4 text-2xl font-bold text-gray-900"
                          >
                            {children}
                          </h1>
                        );
                      },
                      h2: ({ children }) => {
                        const text = Array.isArray(children)
                          ? children.join('')
                          : children?.toString() || '';
                        const id = generateId(text);
                        return (
                          <h2
                            id={id}
                            className="mb-4 mt-8 border-t-2 border-gray-300 pt-3 text-xl font-semibold text-gray-900"
                          >
                            {children}
                          </h2>
                        );
                      },
                      h3: ({ children }) => {
                        const text = Array.isArray(children)
                          ? children.join('')
                          : children?.toString() || '';
                        const id = generateId(text);
                        return (
                          <h3
                            id={id}
                            className="mb-3 mt-6 pt-2 text-lg font-semibold text-gray-900"
                          >
                            {children}
                          </h3>
                        );
                      },
                      // 리스트 스타일링
                      ul: ({ children }) => (
                        <ul className="mb-4 list-inside list-disc space-y-1">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-4 list-inside list-decimal space-y-1">{children}</ol>
                      ),
                      // 단락 스타일링
                      p: ({ children }) => (
                        <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
                      ),
                      // 구분선 스타일링
                      hr: () => <hr className="my-6 border-gray-300" />,
                      // 인용구 스타일링
                      blockquote: ({ children }) => (
                        <blockquote className="mb-4 border-l-4 border-gray-300 pl-4 italic text-gray-600">
                          {children}
                        </blockquote>
                      ),
                      // 이미지 스타일링
                      img: ({ src, alt }) => (
                        <img
                          src={src}
                          alt={alt}
                          className="mx-auto my-4 block h-auto max-w-full rounded-lg shadow-md"
                        />
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
