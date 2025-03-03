'use client'

import { useState } from 'react'
import { Editor } from './editor/Editor'
import { Viewer } from '../viewer/Viewer'
import { PostHeader } from './PostHeader'
import { useRouter } from 'next/navigation'
import { API_URLS } from '@/api/constants/apiUrl'

const themes = [
  { value: 'spring', label: 'Spring' },
  { value: 'nest', label: 'NestJS' },
  { value: 'next', label: 'Next.js' },
  { value: 'react', label: 'React' },
]

type ViewMode = 'edit' | 'preview'

export function PostCreateForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [theme, setTheme] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('edit')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !content || !theme) {
      alert('제목, 내용, 테마를 모두 입력해주세요.')
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
          theme
        })
      })

      if (!response.ok) {
        throw new Error('게시글 등록에 실패했습니다.')
      }

      // 임시저장 데이터 삭제
      localStorage.removeItem('temp_post')
      
      alert('게시글이 등록되었습니다.')
      router.push('/posts')
    } catch (error) {
      console.error('게시글 등록 실패:', error)
      alert('게시글 등록에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleTempSave = () => {
    try {
      localStorage.setItem('temp_post', JSON.stringify({
        title,
        content,
        theme,
        savedAt: new Date().toISOString()
      }))
      
      alert('임시저장되었습니다.')
    } catch (error) {
      console.error('임시저장 실패:', error)
      alert('임시저장에 실패했습니다.')
    }
  }

  return (
    <>
      <PostHeader 
        postData={{
          title,
          content,
          theme
        }}
        onSubmit={handleSubmit}
        onTempSave={handleTempSave}
      />
      <form id="post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full p-2 border rounded text-black placeholder-black"
        />
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full p-2 border rounded text-black border-t-0"
        >
          <option value="">테마를 선택하세요</option>
          {themes.map((theme) => (
            <option key={theme.value} value={theme.value}>
              {theme.label}
            </option>
          ))}
        </select>
        <div className="mt-4">
          <div className="border-b mb-4">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`px-4 py-2 ${
                  viewMode === 'edit'
                    ? 'border-b-2 border-blue-500 font-medium'
                    : 'text-gray-500'
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-4 py-2 ${
                  viewMode === 'preview'
                    ? 'border-b-2 border-blue-500 font-medium'
                    : 'text-gray-500'
                }`}
              >
                Preview
              </button>
            </div>
          </div>
          {viewMode === 'edit' ? (
            <Editor
              initialContent={content}
              onChange={setContent}
            />
          ) : (
            <Viewer content={content} />
          )}
        </div>
      </form>
    </>
  )
}