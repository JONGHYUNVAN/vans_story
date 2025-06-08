'use client'

import { common, createLowlight } from 'lowlight'
import js from 'highlight.js/lib/languages/javascript'
import java from 'highlight.js/lib/languages/java'
import python from 'highlight.js/lib/languages/python'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import kotlin from 'highlight.js/lib/languages/kotlin'
import sql from 'highlight.js/lib/languages/sql'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import rust from 'highlight.js/lib/languages/rust'
import go from 'highlight.js/lib/languages/go'
import ruby from 'highlight.js/lib/languages/ruby'
import swift from 'highlight.js/lib/languages/swift'
import php from 'highlight.js/lib/languages/php'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import bash from 'highlight.js/lib/languages/bash'
import markdown from 'highlight.js/lib/languages/markdown'
import { EditorContent, useEditor } from '@tiptap/react'
import { EditorExtensions } from '../../app/post/new/editor/EditorExtensions'

const lowlight = createLowlight(common)
lowlight.register('js', js)
lowlight.register('javascript', js)
lowlight.register('typescript', typescript)
lowlight.register('html', xml)
lowlight.register('xml', xml)
lowlight.register('css', css)
lowlight.register('python', python)
lowlight.register('java', java)
lowlight.register('kotlin', kotlin)
lowlight.register('sql', sql)
lowlight.register('cpp', cpp)
lowlight.register('csharp', csharp)
lowlight.register('rust', rust)
lowlight.register('go', go)
lowlight.register('ruby', ruby)
lowlight.register('swift', swift)
lowlight.register('php', php)
lowlight.register('json', json)
lowlight.register('yaml', yaml)
lowlight.register('bash', bash)
lowlight.register('markdown', markdown)

export function Viewer({ content }: { content: string }) {
  const editor = useEditor({
    extensions: EditorExtensions,
    content,
    editable: false,
    immediatelyRender: false,
  })

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none [&_pre]:!bg-[#1E1E1E] [&_pre]:!text-white [&_pre]:!rounded-lg [&_pre]:!p-4 [&_pre]:!my-4 [&_pre_code]:!text-sm [&_pre_code]:!font-mono [&_table]:!border-collapse [&_table]:!w-full [&_td]:!border [&_td]:!border-gray-300 [&_td]:!p-2 [&_th]:!border [&_th]:!border-gray-300 [&_th]:!bg-gray-100 [&_th]:!p-2 [&_th]:!font-bold [&_p]:!whitespace-pre-wrap [&_p]:!mb-1">
      <EditorContent editor={editor} />
    </div>
  )
}
