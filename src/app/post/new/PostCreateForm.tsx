'use client'

import { useState } from 'react'
import { Editor } from './editor/Editor'
import { Viewer } from '../viewer/Viewer'

const themes = [
  { value: 'spring', label: 'Spring' },
  { value: 'nest', label: 'NestJS' },
  { value: 'next', label: 'Next.js' },
  { value: 'react', label: 'React' },
]

type ViewMode = 'edit' | 'preview'

export function PostCreateForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [theme, setTheme] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('edit')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('제목:', title)
    console.log('테마:', theme)
    console.log('내용:', content)
  }

  return (
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
  )
}