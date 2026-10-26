'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { EditorExtensions } from '@/components/features/post/editor/EditorExtensions';

export function Viewer({ content }: { content: string | object }) {
  // content가 문자열이면 JSON 파싱 시도, 객체면 그대로 사용
  const parsedContent =
    typeof content === 'string'
      ? (() => {
          try {
            return JSON.parse(content);
          } catch {
            return content; // 파싱 실패 시 원본 문자열 사용
          }
        })()
      : content;

  const editor = useEditor({
    extensions: EditorExtensions,
    content: parsedContent,
    editable: false,
    immediatelyRender: false,
  });

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none [&_p]:mb-1! [&_p]:whitespace-pre-wrap! [&_pre]:my-4! [&_pre]:rounded-lg! [&_pre]:bg-[#1E1E1E]! [&_pre]:p-4! [&_pre]:text-white! [&_pre_code]:font-mono! [&_pre_code]:text-sm! [&_table]:w-full! [&_table]:border-collapse! [&_td]:border! [&_td]:border-gray-300! [&_td]:p-2! [&_th]:border! [&_th]:border-gray-300! [&_th]:bg-gray-100! [&_th]:p-2! [&_th]:font-bold!">
      <EditorContent editor={editor} />
    </div>
  );
}
