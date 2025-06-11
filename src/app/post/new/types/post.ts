export type ViewMode = 'edit' | 'preview'

export interface PostCreateData {
  title: string
  content: any
  theme: string
  topic: string
  description: string
  tags: string[]
  category: string
  thumbnail: string
  language: string
}

export interface PostCreateFormProps {
  postData: PostCreateData
  onSubmit: (e: React.FormEvent) => Promise<void>
  onTempSave: () => void
}

export interface PostCreateViewModeProps {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
} 