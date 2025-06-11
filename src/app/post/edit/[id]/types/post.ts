export type PostData = {
  title: string
  content: string
  theme: string
  topic: string
  description: string
  tags: string[]
  category: string
  thumbnail: string
  language: string
}

export type Post = PostData & {
  id: string
  categoryId: string
}

export type PostEditFormProps = {
  postId: string
}

export type PostEditHeaderProps = {
  postId: string
  postData: PostData
}

export type Category = {
  value: string
  label: string
}

export type PostFormInputsProps = {
  title: string
  setTitle: (title: string) => void
  topic: string
  setTopic: (topic: string) => void
  description: string
  setDescription: (description: string) => void
  theme: string
  setTheme: (theme: string) => void
  language: string
  setLanguage: (language: string) => void
  category: Category | null
  setCategory: (category: Category | null) => void
  thumbnail: string
  setThumbnail: (thumbnail: string) => void
  tags: string[]
  setTags: (tags: string[]) => void
  availableCategories: Category[]
}

export type PostPreviewProps = {
  id: string
  title: string
  content: string
  theme: string
  topic: string
  description: string
  tags: string[]
  category: string
  thumbnail: string
  language: string
} 