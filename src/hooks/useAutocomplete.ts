import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiFetch } from '@/app/api/apiFetch/apiFetch';
import { AutocompleteResponse, AutocompleteSuggestion, AutocompleteApiResponse } from '@/types/api/search';

interface UseAutocompleteOptions {
  /** 디바운스 지연 시간 (ms) */
  debounceMs?: number;
  /** 최대 결과 개수 */
  limit?: number;
  /** 최소 검색어 길이 */
  minLength?: number;
  /** 자동완성 활성화 여부 */
  enabled?: boolean;
  /** 언어 설정 */
  language?: string;
  /** 제안 선택 시 호출되는 콜백 */
  onSelect?: (suggestion: AutocompleteSuggestion) => void;
}

interface UseAutocompleteReturn {
  /** 현재 제안 목록 */
  suggestions: AutocompleteSuggestion[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  error: string | null;
  /** 현재 하이라이트된 인덱스 */
  highlightedIndex: number;
  /** 드롭다운 표시 여부 */
  isOpen: boolean;
  /** 검색어 업데이트 함수 */
  updateQuery: (query: string) => void;
  /** 제안 선택 함수 */
  selectSuggestion: (suggestion: AutocompleteSuggestion) => void;
  /** 키보드 이벤트 핸들러 */
  handleKeyDown: (event: React.KeyboardEvent) => void;
  /** 드롭다운 열기/닫기 */
  setIsOpen: (open: boolean) => void;
  /** 하이라이트 인덱스 설정 */
  setHighlightedIndex: (index: number) => void;
}

/**
 * 자동완성 기능을 위한 커스텀 훅
 */
export function useAutocomplete({
  debounceMs = 300,
  limit = 10,
  minLength = 2,
  enabled = true,
  language = 'all',
  onSelect
}: UseAutocompleteOptions = {}): UseAutocompleteReturn {
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // 백엔드 응답을 프론트엔드 구조로 변환하는 함수
  const transformApiResponse = useCallback((apiResponse: AutocompleteApiResponse, originalQuery: string): AutocompleteResponse => {
    const suggestions: AutocompleteSuggestion[] = apiResponse.suggestions.map((text, index) => ({
      text,
      type: 'query' as const, // 현재는 모든 제안을 'query' 타입으로 처리
      score: 1 - (index * 0.1), // 순서에 따라 점수 부여 (첫 번째가 가장 높음)
      highlight: text.toLowerCase().includes(originalQuery.toLowerCase()) 
        ? text.replace(
            new RegExp(`(${originalQuery})`, 'gi'), 
            '<mark>$1</mark>'
          )
        : undefined
    }));

    return {
      suggestions,
      query: apiResponse.query,
      total: suggestions.length
    };
  }, []);

  // 자동완성 API 호출 함수
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!enabled || !query || query.length < minLength) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새 AbortController 생성
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await ApiFetch.getAutocompleteSuggestions(
        query, 
        limit, 
        language,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        throw new Error('자동완성 요청이 실패했습니다.');
      }

      const apiData: AutocompleteApiResponse = await response.json();
      const transformedData = transformApiResponse(apiData, query);
      
      setSuggestions(transformedData.suggestions || []);
      setIsOpen(transformedData.suggestions.length > 0);
      setHighlightedIndex(-1);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Autocomplete fetch error:', err);
        setError(err.message || '자동완성을 불러오는 중 오류가 발생했습니다.');
        setSuggestions([]);
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [enabled, limit, minLength, language, transformApiResponse]);

  // 디바운스된 검색어 업데이트
  const updateQuery = useCallback((query: string) => {
    setCurrentQuery(query);
    
    // 이전 타이머 클리어
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // 새 타이머 설정
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, debounceMs);
  }, [fetchSuggestions, debounceMs]);

  // 제안 선택
  const selectSuggestion = useCallback((suggestion: AutocompleteSuggestion) => {
    setIsOpen(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
    // 외부 콜백 호출
    if (onSelect) {
      onSelect(suggestion);
    }
  }, [onSelect]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          selectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [isOpen, suggestions, highlightedIndex, selectSuggestion]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
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
  };
}
