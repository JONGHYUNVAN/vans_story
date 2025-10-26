/**
 * 통합 PostFormInputs 컴포넌트
 * 새로운 타입 시스템을 사용하며 생성/편집 모두에서 사용 가능
 */

import { useTranslation } from '@/utils/i18n'
import { PostFormInputsProps } from '@/types/post'
import { MAIN_CATEGORIES } from '@/constants/mainCategories'

// 언어 옵션 배열
const LANGUAGES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' }
]

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
    <div className="space-y-3">
      {/* 제목 */}
      <div>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder={t('post.create.inputTitle')}
          className={getFieldClassName('title', 'w-full p-2 border rounded text-black placeholder-black text-center')}
          disabled={disabled}
        />
        {getFieldError('title') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('title')}</p>
        )}
      </div>

      {/* 사용자 정의 주제 */}
      <div>
        <input
          type="text"
          value={data.topic || ''}
          onChange={(e) => onChange('topic', e.target.value)}
          placeholder={t('post.create.inputTopic')}
          className={getFieldClassName('topic', 'w-full p-2 border rounded text-black placeholder-black text-center')}
          disabled={disabled}
        />
        {getFieldError('topic') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('topic')}</p>
        )}
      </div>

      {/* 설명 */}
      <div>
        <input
          type="text"
          value={data.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder={t('post.create.inputDescription')}
          className={getFieldClassName('description', 'w-full p-2 border rounded text-black placeholder-black text-center')}
          disabled={disabled}
        />
        {getFieldError('description') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('description')}</p>
        )}
      </div>

      {/* 메인 카테고리 */}
      <div>
        <select
          value={data.mainCategory || ''}
          onChange={(e) => onChange('mainCategory', e.target.value)}
          className={getFieldClassName('mainCategory', 'w-full p-2 border rounded text-black text-center')}
          disabled={disabled}
        >
          <option value="">{t('post.create.selectMainCategory')}</option>
          {MAIN_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {getFieldError('mainCategory') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('mainCategory')}</p>
        )}
      </div>

      {/* 하위 카테고리 */}
      <div>
        <select
          value={selectedSubCategory?.value || ''}
          onChange={(e) => {
            console.log('🔄 하위 카테고리 select onChange:', e.target.value)
            const selected = availableSubCategories.find(c => c.value === e.target.value)
            onSubCategoryChange(selected || null)
            if (selected) {
              onChange('subCategory', selected.value)
            }
          }}
          className={getFieldClassName('subCategory', 'w-full p-2 border rounded text-black text-center')}
          disabled={disabled || availableSubCategories.length === 0}
        >
          <option value="">{t('post.create.selectSubCategory')}</option>
          {availableSubCategories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
              {cat.description && ` - ${cat.description}`}
            </option>
          ))}
        </select>
        {getFieldError('subCategory') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('subCategory')}</p>
        )}
      </div>

      {/* 언어 */}
      <div>
        <select
          value={data.language || 'ko'}
          onChange={(e) => onChange('language', e.target.value)}
          className={getFieldClassName('language', 'w-full p-2 border rounded text-black text-center')}
          disabled={disabled}
        >
          <option value="">{t('post.create.selectLanguage')}</option>
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

      {/* 썸네일 */}
      <div>
        <input
          type="text"
          value={data.thumbnail || ''}
          onChange={(e) => onChange('thumbnail', e.target.value)}
          placeholder={t('post.create.inputThumbnail')}
          className={getFieldClassName('thumbnail', 'w-full p-2 border rounded text-black placeholder-black text-center')}
          disabled={disabled}
        />
        {getFieldError('thumbnail') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('thumbnail')}</p>
        )}
      </div>

      {/* 태그 */}
      <div>
        <input
          type="text"
          value={data.tags?.join(', ') || ''}
          onChange={(e) => onChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
          placeholder={t('post.create.inputTags')}
          className={getFieldClassName('tags', 'w-full p-2 border rounded text-black placeholder-black')}
          disabled={disabled}
        />
        {getFieldError('tags') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('tags')}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          쉼표로 구분하여 입력하세요
        </p>
      </div>
    </div>
  )
}
