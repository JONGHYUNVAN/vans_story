'use client';

import React, { useRef, useEffect, forwardRef, useCallback } from 'react';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import { AutocompleteSuggestion } from '@/types/api/search';

interface AutocompleteInputProps {
  /** 입력 필드의 값 */
  value: string;
  /** 값 변경 핸들러 */
  onChange: (value: string) => void;
  /** 제안 선택 핸들러 */
  onSelect: (suggestion: AutocompleteSuggestion) => void;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** CSS 클래스명 */
  className?: string;
  /** 입력 필드 CSS 클래스명 */
  inputClassName?: string;
  /** 드롭다운 CSS 클래스명 */
  dropdownClassName?: string;
  /** 자동완성 비활성화 */
  disabled?: boolean;
  /** 최소 검색어 길이 */
  minLength?: number;
  /** 최대 결과 개수 */
  limit?: number;
  /** 디바운스 지연 시간 */
  debounceMs?: number;
  /** 언어 설정 */
  language?: string;
  /** 추가 입력 필드 props */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

/**
 * 자동완성 기능이 있는 입력 컴포넌트
 */
export const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
  (
    {
      value,
      onChange,
      onSelect,
      placeholder,
      className = '',
      inputClassName = '',
      dropdownClassName = '',
      disabled = false,
      minLength = 2,
      limit = 10,
      debounceMs = 300,
      language = 'all',
      inputProps = {},
      ...rest
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // ref 병합
    const mergedInputRef = (ref || inputRef) as React.RefObject<HTMLInputElement>;

    // 자동완성 제안 선택 처리 (키보드 네비게이션용)
    const handleAutocompleteSelect = useCallback(
      (suggestion: AutocompleteSuggestion) => {
        onChange(suggestion.text);
        onSelect(suggestion);
      },
      [onChange, onSelect],
    );

    const {
      suggestions,
      isLoading,
      error,
      highlightedIndex,
      isOpen,
      updateQuery,
      selectSuggestion,
      handleKeyDown,
      setIsOpen,
      setHighlightedIndex,
    } = useAutocomplete({
      debounceMs,
      limit,
      minLength,
      language,
      enabled: !disabled,
      onSelect: handleAutocompleteSelect,
    });

    // 입력값 변경 처리
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      updateQuery(newValue);
    };

    // 제안 선택 처리 (마우스 클릭용)
    const handleSuggestionSelect = (suggestion: AutocompleteSuggestion) => {
      selectSuggestion(suggestion);
      // selectSuggestion 내부에서 이미 onSelect가 호출되므로 중복 호출 방지
      // onChange는 여기서 직접 호출
      onChange(suggestion.text);
    };

    // 마우스로 제안 선택
    const handleSuggestionClick = (suggestion: AutocompleteSuggestion, index: number) => {
      handleSuggestionSelect(suggestion);
    };

    // 마우스 호버 처리
    const handleSuggestionMouseEnter = (index: number) => {
      setHighlightedIndex(index);
    };

    // 외부 클릭 감지
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    // 제안 타입별 아이콘
    const getSuggestionIcon = (type: AutocompleteSuggestion['type']) => {
      switch (type) {
        case 'query':
          return '🔍';
        case 'title':
          return '📄';
        case 'category':
          return '📁';
        case 'tag':
          return '🏷️';
        default:
          return '💡';
      }
    };

    // 제안 타입별 라벨
    const getSuggestionTypeLabel = (type: AutocompleteSuggestion['type']) => {
      switch (type) {
        case 'query':
          return '검색어';
        case 'title':
          return '제목';
        case 'category':
          return '카테고리';
        case 'tag':
          return '태그';
        default:
          return '제안';
      }
    };

    return (
      <div ref={containerRef} className={`relative ${className}`}>
        <style jsx>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        {/* 입력 필드 */}
        <div className="relative">
          <input
            ref={mergedInputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => value.length >= minLength && setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClassName}
            autoComplete="off"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-activedescendant={
              highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
            }
            {...inputProps}
          />

          {/* 로딩 인디케이터 */}
          {isLoading && (
            <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2 transform">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* 자동완성 제안 목록 */}
        <div
          className={`overflow-hidden transition-all duration-700 ease-out ${
            isOpen && (suggestions.length > 0 || error)
              ? 'mt-2 max-h-80 opacity-100'
              : 'mt-0 max-h-0 opacity-0'
          }`}
        >
          <div
            className={`transform transition-all duration-700 ease-out ${
              isOpen && (suggestions.length > 0 || error)
                ? 'translate-y-0 rotate-0 scale-100'
                : '-translate-y-4 rotate-1 scale-90'
            }`}
            role="listbox"
          >
            {error ? (
              <div className="px-4 py-3 text-sm text-red-400">{error}</div>
            ) : suggestions.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.type}-${suggestion.text}-${index}`}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={index === highlightedIndex}
                    className={`mx-2 my-1 flex cursor-pointer items-center space-x-3 rounded-lg px-5 py-4 transition-all duration-300 ease-out ${
                      index === highlightedIndex
                        ? 'scale-[1.02] bg-blue-500/20 text-blue-200 shadow-lg backdrop-blur-sm'
                        : 'text-gray-200 hover:scale-[1.01] hover:bg-white/10 hover:shadow-md'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isOpen ? 'slideInUp 0.4s ease-out forwards' : 'none',
                    }}
                    onClick={() => handleSuggestionClick(suggestion, index)}
                    onMouseEnter={() => handleSuggestionMouseEnter(index)}
                  >
                    <span className="transform text-lg transition-transform duration-200 hover:scale-110">
                      {getSuggestionIcon(suggestion.type)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className="truncate font-medium"
                          dangerouslySetInnerHTML={{
                            __html: suggestion.highlight || suggestion.text,
                          }}
                        />
                        <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-gray-400 backdrop-blur-sm">
                          {getSuggestionTypeLabel(suggestion.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

AutocompleteInput.displayName = 'AutocompleteInput';
