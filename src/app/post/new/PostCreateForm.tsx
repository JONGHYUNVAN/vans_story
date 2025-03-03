'use client'

import { useState, useEffect } from 'react'
import { Editor } from './editor/Editor'
import { Viewer } from '../viewer/Viewer'
import { PostHeader } from './PostHeader'
import { useRouter } from 'next/navigation'
import { API_URLS } from '@/api/constants/apiUrl'
import { THEMES, CATEGORIES, getCategoriesByTheme } from '@/constants/themes'
import { useTranslation } from '@/utils/i18n'
import  PostCard from '../view/postcard/new/PostCard'

type ViewMode = 'edit' | 'preview'

// 언어 옵션 배열 추가
const LANGUAGES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' }
]

export function PostCreateForm() {
  const router = useRouter()
  const { t } = useTranslation('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [theme, setTheme] = useState('next')
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [language, setLanguage] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [availableCategories, setAvailableCategories] = useState([] as typeof CATEGORIES)

  // 컴포넌트 마운트 시 기본 테마 확인
  useEffect(() => {
    if (!theme || theme === '') {
      setTheme('next')
    }
  }, [])

  // 테마가 변경될 때 해당 테마에 맞는 카테고리 목록 업데이트
  useEffect(() => {
    if (theme) {
      const filteredCategories = getCategoriesByTheme(theme)
      setAvailableCategories(filteredCategories)
      
      // 기존 선택된 카테고리가 새 테마에 없으면 초기화
      if (!filteredCategories.some(c => c.value === category)) {
        setCategory('')
      }
    } else {
      setAvailableCategories([])
      setCategory('')
    }
  }, [theme, category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !content || !theme || !topic || !description || !author || !category || !language) {
      alert(t('post.create.validation'))
      return
    }

    try {
      const response = await fetch(API_URLS.POST.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          theme,
          topic,
          description,
          author,
          tags,
          category,
          thumbnail,
          language
        })
      })

      if (!response.ok) {
        throw new Error(t('post.create.submitError'))
      }

      // 임시저장 데이터 삭제
      localStorage.removeItem('temp_post')
      
      const data = await response.json()
      router.push(`/post/${data.id}`)
    } catch (error) {
      console.error('Error submitting post:', error)
      alert(t('post.create.submitError'))
    }
  }

  const handleTempSave = () => {
    if (title || content || theme || topic || description || author || tags.length > 0 || category || thumbnail || language) {
      localStorage.setItem('temp_post', JSON.stringify({
        title,
        content,
        theme,
        topic,
        description,
        author,
        tags,
        category,
        thumbnail,
        language
      }))
      alert(t('post.create.tempSaveSuccess'))
    }
  }

  // 페이지 로드 시 임시저장 데이터 확인
  useEffect(() => {
    const savedPost = localStorage.getItem('temp_post')
    if (savedPost) {
      try {
        const postData = JSON.parse(savedPost)
        setTitle(postData.title || '')
        setContent(postData.content || '')
        setTheme(postData.theme || '')
        setTopic(postData.topic || '')
        setDescription(postData.description || '')
        setAuthor(postData.author || '')
        setTags(postData.tags || [])
        setCategory(postData.category || '')
        setThumbnail(postData.thumbnail || '')
        setLanguage(postData.language || '')
      } catch (error) {
        console.error(t('post.create.tempSaveError'), error)
      }
    }
  }, [t])

  return (
    <>
      <PostHeader 
        postData={{
          title,
          content,
          theme,
          topic,
          description,
          tags,
          category,
          thumbnail,
          language
        }}
        onSubmit={handleSubmit}
        onTempSave={handleTempSave}
      />
      
      <div className="mt-2 border rounded flex">
        <button
          type="button"
          className={`py-2 px-4 ${viewMode === 'edit' ? 'bg-gray-200' : ''}`}
          onClick={() => setViewMode('edit')}
        >
          {t('post.create.edit')}
        </button>
        <button
          type="button"
          className={`py-2 px-4 ${viewMode === 'preview' ? 'bg-gray-200' : ''}`}
          onClick={() => setViewMode('preview')}
        >
          {t('post.create.preview')}
        </button>
      </div>

      {viewMode === 'edit' ? (
        <form id="post-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('post.create.inputTitle')}
            className="w-full p-2 border rounded text-black placeholder-black text-center"
          />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t('post.create.inputTopic')}
            className="w-full p-2 border rounded text-black placeholder-black mt-2 text-center"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('post.create.inputDescription')}
            className="w-full p-2 border rounded text-black placeholder-black mt-2 text-center "
          />

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-2 border rounded text-black mt-2 text-center"
          >
            <option value="">{t('post.create.selectTheme')}</option>
            {THEMES.map((theme) => (
              <option key={theme.value} value={theme.value}>{theme.label}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded text-black mt-2 text-center"
            disabled={availableCategories.length === 0}
          >
            <option value="">{t('post.create.selectCategory')}</option>
            {availableCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder={t('post.create.inputThumbnail')}
            className="w-full p-2 border rounded text-black placeholder-black mt-2 text-center"
          />
          
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border rounded text-black mt-2 text-center"
          >
            <option value="">{t('post.create.selectLanguage')}</option>
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
          
          <Editor
            initialContent={content}
            onChange={setContent}
          />
        </form>
      ) : (
        <div className="mt-2">
          <PostCard 
            post={{
              id: 'preview',
              title: title || t('post.create.inputTitle'),
              description: description || t('post.create.inputDescription'),
              createdAt: new Date().toISOString(),
              tags: tags,
              viewCount: 0,
              likeCount: 0,
              topic: topic || t('post.create.inputTopic'),
              author: author || t('post.create.inputAuthor'),
              thumbnail: thumbnail,
              theme: theme
            }}
          />
          <div className="mt-4 p-2 border rounded">
            <Viewer content={content} />
          </div>
        </div>
      )}
      <input
        type="text"
        value={tags.join(', ')}
        onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
        placeholder={t('post.create.inputTags')}
        className="w-full p-2 border rounded text-black placeholder-black mt-2"
      />
    </>
  )
}