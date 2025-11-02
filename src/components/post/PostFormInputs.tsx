/**
 * 통합 PostFormInputs 컴포넌트
 * 새로운 타입 시스템을 사용하며 생성/편집 모두에서 사용 가능
 */

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '@/utils/i18n'
import { PostFormInputsProps, SubCategoryOption, BasePost, MainCategoryOption } from '@/types/post'
import { MAIN_CATEGORIES, CATEGORY_GROUPS, CategoryGroup } from '@/constants/mainCategories'
import { ChevronDown } from 'lucide-react'

// 언어 옵션 배열
const LANGUAGES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' }
]

// 메인 카테고리 펼침/접기 컴포넌트
interface MainCategoryCollapsibleProps {
  selectedValue: string
  onChange: (field: keyof BasePost, value: any) => void
  disabled: boolean
  error: string
  t: any
}

function MainCategoryCollapsible({
  selectedValue,
  onChange,
  disabled,
  error,
  t
}: MainCategoryCollapsibleProps) {
  // 선택되지 않았으면 펼쳐진 상태로, 선택되었으면 접힌 상태로 시작
  const [isExpanded, setIsExpanded] = useState(!selectedValue)
  
  // 선택된 카테고리 찾기
  const selectedCategory = MAIN_CATEGORIES.find(cat => cat.value === selectedValue)

  return (
    <div className="space-y-3">
      {/* 레이블과 선택된 값 표시 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-semibold text-gray-700">
            메인 카테고리
            <span className="text-red-500 ml-1">*</span>
          </label>
          {selectedCategory && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md">
              {selectedCategory.icon && (
                typeof selectedCategory.icon === 'string' ? (
                  <img 
                    src={selectedCategory.icon} 
                    alt={selectedCategory.label}
                    className="w-4 h-4 object-contain"
                  />
                ) : (
                  <selectedCategory.icon 
                    className="w-4 h-4" 
                    style={{ color: selectedCategory.color }}
                  />
                )
              )}
              <span className="text-xs font-medium text-blue-900">{selectedCategory.label}</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          <span>{isExpanded ? '접기' : '변경'}</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* 펼쳐졌을 때 라디오 버튼 그룹 표시 */}
      {isExpanded && (
        <div className="space-y-3 pt-2">
          {(Object.keys(CATEGORY_GROUPS) as CategoryGroup[]).map((groupKey) => {
            const group = CATEGORY_GROUPS[groupKey]
            return (
              <div key={groupKey} className="space-y-2">
                {/* 그룹 제목 */}
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {group.label}
                </div>
                
                {/* 라디오 버튼들 */}
                <div className="grid grid-cols-2 gap-2">
                  {group.categories.map((category: MainCategoryOption) => {
                    const isSelected = selectedValue === category.value
                    return (
                      <label
                        key={category.value}
                        className={`
                          flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50 text-blue-900' 
                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                          }
                          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <input
                          type="radio"
                          name="mainCategory"
                          value={category.value}
                          checked={isSelected}
                          onChange={(e) => onChange('mainCategory', e.target.value)}
                          disabled={disabled}
                          className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        {category.icon && (
                          typeof category.icon === 'string' ? (
                            <img 
                              src={category.icon} 
                              alt={category.label}
                              className="w-5 h-5 object-contain"
                            />
                          ) : (
                            <category.icon 
                              className="w-5 h-5" 
                              style={{ color: category.color }}
                            />
                          )
                        )}
                        <span className="text-sm font-medium">{category.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

// 하위 카테고리 드롭다운 컴포넌트
interface SubCategoryDropdownProps {
  availableSubCategories: SubCategoryOption[]
  selectedSubCategory: SubCategoryOption | null
  onSubCategoryChange: (subCategory: SubCategoryOption | null) => void
  onChange: (field: keyof BasePost, value: any) => void
  disabled: boolean
  error: string
  t: any
}

function SubCategoryDropdown({
  availableSubCategories,
  selectedSubCategory,
  onSubCategoryChange,
  onChange,
  disabled,
  error,
  t
}: SubCategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSelect = (cat: SubCategoryOption) => {
    onSubCategoryChange(cat)
    onChange('subCategory', cat.value)
    setIsOpen(false)
  }

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        하위 카테고리
      </label>

      {/* 드롭다운 버튼 */}
      <button
        type="button"
        onClick={() => !disabled && availableSubCategories.length > 0 && setIsOpen(!isOpen)}
        disabled={disabled || availableSubCategories.length === 0}
        className={`
          w-full p-3 border-2 rounded-lg text-left transition-all
          flex items-center justify-between
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled || availableSubCategories.length === 0
            ? 'bg-gray-100 cursor-not-allowed text-gray-500'
            : 'bg-white hover:border-blue-400 cursor-pointer'
          }
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : ''}
        `}
      >
        <div className="flex-1">
          {selectedSubCategory ? (
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {selectedSubCategory.label}
              </div>
              {selectedSubCategory.description && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {selectedSubCategory.description}
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-500">
              {availableSubCategories.length === 0
                ? '먼저 메인 카테고리를 선택해주세요'
                : '세부 카테고리를 선택하세요'
              }
            </span>
          )}
        </div>
        <ChevronDown 
          size={20} 
          className={`transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && availableSubCategories.length > 0 && (
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 z-10 mt-1 max-h-80 overflow-y-auto bg-white border-2 border-blue-500 rounded-lg shadow-lg">
            {availableSubCategories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleSelect(cat)}
                className={`
                  w-full p-3 text-left transition-colors
                  hover:bg-blue-50
                  ${selectedSubCategory?.value === cat.value ? 'bg-blue-50' : ''}
                  border-b border-gray-100 last:border-b-0
                `}
              >
                <div className="text-sm font-semibold text-gray-900">
                  {cat.label}
                </div>
                {cat.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {cat.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

export function PostFormInputs({
  data,
  onChange,
  availableSubCategories,
  selectedSubCategory,
  onSubCategoryChange,
  errors = {},
  disabled = false
}: PostFormInputsProps) {
  const { t } = useTranslation('')

  // 에러 표시 헬퍼
  const getFieldError = (field: string) => {
    return errors[field] || ''
  }

  // 필드 스타일 헬퍼
  const getFieldClassName = (field: string, baseClassName: string) => {
    const hasError = !!errors[field]
    return `${baseClassName} ${hasError ? 'border-red-500' : 'border-gray-300'}`
  }

  return (
    <div className="space-y-6">
      {/* 섹션 1: 기본 정보 */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-800 border-b pb-2">📝 기본 정보</h3>
        
        {/* 제목 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="제목을 입력하세요"
            className={getFieldClassName('title', 'w-full p-3 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all')}
            disabled={disabled}
          />
          {getFieldError('title') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('title')}</p>
          )}
        </div>

        {/* 주제 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            주제 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.topic || ''}
            onChange={(e) => onChange('topic', e.target.value)}
            placeholder="구체적인 주제를 입력하세요 (예: React Hooks 사용법)"
            className={getFieldClassName('topic', 'w-full p-3 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all')}
            disabled={disabled}
          />
          {getFieldError('topic') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('topic')}</p>
          )}
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            설명 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="간단한 설명을 입력하세요"
            rows={3}
            className={getFieldClassName('description', 'w-full p-3 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none')}
            disabled={disabled}
          />
          {getFieldError('description') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('description')}</p>
          )}
        </div>
      </div>

      {/* 섹션 2: 분류 */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-800 border-b pb-2">🗂️ 분류</h3>
        
        {/* 메인 카테고리 */}
        <MainCategoryCollapsible
          selectedValue={data.mainCategory || ''}
          onChange={onChange}
          disabled={disabled}
          error={getFieldError('mainCategory')}
          t={t}
        />

        {/* 하위 카테고리 */}
        <SubCategoryDropdown
          availableSubCategories={availableSubCategories}
          selectedSubCategory={selectedSubCategory}
          onSubCategoryChange={onSubCategoryChange}
          onChange={onChange}
          disabled={disabled}
          error={getFieldError('subCategory')}
          t={t}
        />
      </div>

      {/* 섹션 3: 부가 정보 */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-800 border-b pb-2">⚙️ 부가 정보</h3>
        
        {/* 썸네일 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            썸네일 URL
          </label>
          <input
            type="text"
            value={data.thumbnail || ''}
            onChange={(e) => onChange('thumbnail', e.target.value)}
            placeholder="썸네일 이미지 URL을 입력하세요"
            className={getFieldClassName('thumbnail', 'w-full p-3 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all')}
            disabled={disabled}
          />
          {getFieldError('thumbnail') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('thumbnail')}</p>
          )}
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            태그
          </label>
          
          {/* 태그 배지 영역 */}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2 p-2 border-2 border-gray-200 rounded-lg bg-gray-50">
              {data.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = data.tags?.filter((_, i) => i !== index) || []
                      onChange('tags', newTags)
                    }}
                    className="hover:text-gray-200 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {/* 태그 입력 */}
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                let inputValue = e.currentTarget.value.trim()
                
                // # 기호 제거
                if (inputValue.startsWith('#')) {
                  inputValue = inputValue.substring(1).trim()
                }
                
                if (inputValue) {
                  const currentTags = data.tags || []
                  // 대소문자 구분 없이 중복 체크
                  const isDuplicate = currentTags.some(
                    tag => tag.toLowerCase() === inputValue.toLowerCase()
                  )
                  if (!isDuplicate) {
                    onChange('tags', [...currentTags, inputValue])
                  }
                  e.currentTarget.value = ''
                }
              }
            }}
            placeholder="태그를 입력하고 Enter를 누르세요"
            className={getFieldClassName('tags', 'w-full p-3 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all')}
            disabled={disabled}
          />
          {getFieldError('tags') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('tags')}</p>
          )}
          <p className="text-gray-500 text-xs mt-1.5">
            💡 Enter 키를 눌러 태그를 추가하세요
          </p>
        </div>

        {/* 언어 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            언어
          </label>
          <select
            value={data.language || 'ko'}
            onChange={(e) => onChange('language', e.target.value)}
            className={getFieldClassName('language', 'w-full p-3 border-2 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all')}
            disabled={disabled}
          >
            <option value="">언어를 선택하세요</option>
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          {getFieldError('language') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('language')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
