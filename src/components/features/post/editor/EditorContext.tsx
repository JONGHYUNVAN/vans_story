'use client'
import { Editor } from '@tiptap/react'
import { createContext, useContext } from 'react'

const EditorContext = createContext<Editor | null>(null)

export const useEditorContext = () => useContext(EditorContext)
export const EditorProvider = EditorContext.Provider