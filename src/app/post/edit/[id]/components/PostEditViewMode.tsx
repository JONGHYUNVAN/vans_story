'use client'

import { useTranslation } from '@/utils/i18n'

type ViewMode = 'edit' | 'preview'

interface PostEditViewModeProps {
  viewMode: ViewMode
}

export function PostEditViewMode({ viewMode }: PostEditViewModeProps) {
  const { t } = useTranslation('')

  const handleModeChange = (mode: ViewMode) => {
    // URL 쿼리 파라미터를 통해 모드 변경
    const url = new URL(window.location.href)
    url.searchParams.set('mode', mode)
    window.history.pushState({}, '', url.toString())
    
    // 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent('viewModeChange', { detail: { mode } }))
  }

  return (
    <div className="mt-2 border rounded flex">
      <button
        type="button"
        className={`py-2 px-4 ${viewMode === 'edit' ? 'bg-gray-200' : ''}`}
        onClick={() => handleModeChange('edit')}
      >
        {t('post.create.edit')}
      </button>
      <button
        type="button"
        className={`py-2 px-4 ${viewMode === 'preview' ? 'bg-gray-200' : ''}`}
        onClick={() => handleModeChange('preview')}
      >
        {t('post.create.preview')}
      </button>
    </div>
  )
} 