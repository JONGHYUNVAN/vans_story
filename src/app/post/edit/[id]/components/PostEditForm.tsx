'use client'

import { Editor } from '@/components/editor/Editor'
import { PostFormInputs } from '@/app/post/new/components/PostFormInputs'
import { PostPreview } from '../../../../../components/editor/EditorPreview'
import { PostEditHeader } from './PostEditHeader'
import { PostEditViewMode } from './PostEditViewMode'
import { usePostEdit } from '../hooks/usePostEdit'

interface PostEditFormProps {
  postId: string
}

export function PostEditForm({ postId }: PostEditFormProps) {
  const {
    // 상태
    title,
    setTitle,
    content,
    setContent,
    theme,
    setTheme,
    topic,
    setTopic,
    description,
    setDescription,
    tags,
    setTags,
    thumbnail,
    setThumbnail,
    language,
    setLanguage,
    viewMode,
    isLoading,
    error,
    
    // 카테고리 관련
    categories,
    selectedCategory,
    setSelectedCategory,
    
    // 핸들러
    handleSubmit,
    handleTempSave,
    
    // 현재 포스트 데이터
    currentPostData
  } = usePostEdit(postId)

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  const handleEditorChange = (json: object) => {
    setContent(JSON.stringify(json))
  }

  return (
    <>
      <PostEditHeader 
        postId={postId}
        postData={currentPostData}
        onSubmit={handleSubmit}
        onTempSave={handleTempSave}
      />
      
      <PostEditViewMode viewMode={viewMode} />

      {viewMode === 'edit' ? (
        <div className="space-y-6">
          <PostFormInputs
            title={title}
            setTitle={setTitle}
            topic={topic}
            setTopic={setTopic}
            description={description}
            setDescription={setDescription}
            theme={theme}
            setTheme={setTheme}
            language={language}
            setLanguage={setLanguage}
            category={selectedCategory}
            setCategory={setSelectedCategory}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
            tags={tags}
            setTags={setTags}
            availableCategories={categories}
          />
          <Editor initialContent={content} onChange={handleEditorChange} />
        </div>
      ) : (
        <div className="bg-black -mx-8 -mb-8 mt-4 p-8">
          <PostPreview
            id={postId}
            title={title}
            content={content}
            theme={theme}
            topic={topic}
            description={description}
            tags={tags}
            category={selectedCategory?.value || ''}
            thumbnail={thumbnail}
            language={language}
          />
        </div>
      )}
    </>
  )
} 