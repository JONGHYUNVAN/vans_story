'use client'

import { useState } from 'react'
import { Editor } from './editor/Editor'

interface PostCreateFormProps {
  submitUrl: string
}

export function PostCreateForm({ submitUrl }: PostCreateFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content })
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full p-2 border rounded"
      />
      <Editor
        initialContent={content}
        onChange={setContent}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        작성완료
      </button>
    </form>
  )
}