'use client';

import React, { useRef, useEffect, forwardRef } from 'react';
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
  /** 추가 입력 필드 props */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

/**
 * 자동완성 기능이 있는 입력 컴포넌트
 */
export const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
  ({
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
    inputProps = {},
    ...rest
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    // ref 병합
    const mergedInputRef = (ref || inputRef) as React.RefObject<HTMLInputElement>;

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
      setHighlightedIndex
    } = useAutocomplete({
      debounceMs,
      limit,
      minLength,
      enabled: !disabled
    });

    // 입력값 변경 처리
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      updateQuery(newValue);
    };

    // 제안 선택 처리
    const handleSuggestionSelect = (suggestion: AutocompleteSuggestion) => {
      selectSuggestion(suggestion);
      onSelect(suggestion);
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
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* 자동완성 드롭다운 */}
        {isOpen && (
          <div
            className={`absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto ${dropdownClassName}`}
            role="listbox"
          >
            {error ? (
              <div className="px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.type}-${suggestion.text}-${index}`}
                  id={`suggestion-${index}`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  className={`px-4 py-3 cursor-pointer flex items-center space-x-3 border-b border-gray-700 last:border-b-0 transition-colors ${
                    index === highlightedIndex
                      ? 'bg-blue-600/20 text-blue-300'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion, index)}
                  onMouseEnter={() => handleSuggestionMouseEnter(index)}
                >
                  <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span 
                        className="truncate"
                        dangerouslySetInnerHTML={{
                          __html: suggestion.highlight || suggestion.text
                        }}
                      />
                      <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                        {getSuggestionTypeLabel(suggestion.type)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-sm">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

AutocompleteInput.displayName = 'AutocompleteInput';
