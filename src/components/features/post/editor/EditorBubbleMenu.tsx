'use client';
import { useEffect, useRef, useState } from 'react';
import { BubbleMenuPlugin, type BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
import type { Editor } from '@tiptap/core';
import { Bold, Italic, Underline, Palette, Sparkles, Trash2 } from 'lucide-react';
import { sendChatMessage } from '@/lib/ai/clientActions';
import { useEditorContext } from './EditorContext';

// ─── Tiptap 3.20 BubbleMenu React 래퍼 ─────────────────────────────────────
interface TiptapBubbleMenuProps {
  editor: Editor;
  pluginKey: string;
  shouldShow?: BubbleMenuPluginProps['shouldShow'];
  className?: string;
  children: React.ReactNode;
}

function TiptapBubbleMenu({
  editor,
  pluginKey,
  shouldShow,
  className,
  children,
}: TiptapBubbleMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current) return;

    const plugin = BubbleMenuPlugin({
      pluginKey,
      editor,
      element: menuRef.current,
      shouldShow: shouldShow ?? null,
    });

    editor.registerPlugin(plugin);

    return () => {
      editor.unregisterPlugin(pluginKey);
    };
  }, [editor, pluginKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={menuRef}
      className={className}
      style={{ visibility: 'hidden', position: 'absolute', zIndex: 50 }}
    >
      {children}
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

const ICONS = {
  insert_up: '/icons/insert_up.ico',
  insert_down: '/icons/insert_down.ico',
  insert_left: '/icons/insert_left.ico',
  insert_right: '/icons/insert_right.ico',
  remove_row: '/icons/remove_row.ico',
  remove_column: '/icons/remove_column.ico',
  merge: '/icons/merge.ico',
  divide: '/icons/divide.ico',
  align_left: '/icons/align_left.ico',
  align_center: '/icons/align_center.ico',
  align_right: '/icons/align_right.ico',
} as const;

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '40'];

/**
 * 텍스트 선택 시 나타나는 버블 메뉴 컴포넌트
 * @component
 */
export function EditorBubbleMenu() {
  const editor = useEditorContext();
  const [isFixing, setIsFixing] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [isAiOperating, setIsAiOperating] = useState(false); // AI 작업 플래그

  // 에디터 로드 시 기존 블록의 버튼에 이벤트 등록
  useEffect(() => {
    if (!editor) return;

    const attachExistingButtons = () => {
      const allUndoBtns = document.querySelectorAll('[data-ai-action="undo"]');
      const allKeepBtns = document.querySelectorAll('[data-ai-action="keep"]');

      if (allUndoBtns.length === 0 && allKeepBtns.length === 0) return;

      console.log('🔄 페이지 로드 - 기존 버튼 발견:', allUndoBtns.length, allKeepBtns.length);

      allUndoBtns.forEach((btn) => {
        const undoBtn = btn as HTMLElement;
        // 데이터 속성에서 텍스트 추출
        const parentDiv = undoBtn.closest('[data-ai-diff-type]');
        if (!parentDiv) return;

        const originalDiv = document.querySelector('[data-ai-diff-type="original"]');
        const suggestedDiv = document.querySelector('[data-ai-diff-type="suggested"]');

        const capturedOriginalText =
          originalDiv?.textContent?.replace(/UndoKeep/g, '').trim() || '';
        const capturedSuggestedText =
          suggestedDiv?.textContent?.replace(/UndoKeep/g, '').trim() || '';

        console.log('📝 추출된 텍스트:', { capturedOriginalText, capturedSuggestedText });

        undoBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🔴 Undo (기존 블록)');

          const html = editor.getHTML();
          let newHtml = html.replace(
            /<div[^>]*data-ai-diff-type="original"[^>]*>[\s\S]*?<\/div>/,
            `<p>${capturedOriginalText}</p>`,
          );
          newHtml = newHtml.replace(
            /<div[^>]*data-ai-diff-type="suggested"[^>]*>[\s\S]*?<\/div>/,
            '',
          );
          editor.commands.setContent(newHtml);
        };
      });

      allKeepBtns.forEach((btn) => {
        const keepBtn = btn as HTMLElement;
        const parentDiv = keepBtn.closest('[data-ai-diff-type]');
        if (!parentDiv) return;

        const suggestedDiv = document.querySelector('[data-ai-diff-type="suggested"]');

        const capturedSuggestedText =
          suggestedDiv?.textContent?.replace(/UndoKeep/g, '').trim() || '';

        keepBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🟢 Keep (기존 블록)');

          const html = editor.getHTML();
          let newHtml = html.replace(
            /<div[^>]*data-ai-diff-type="original"[^>]*>[\s\S]*?<\/div>/,
            '',
          );
          newHtml = newHtml.replace(
            /<div[^>]*data-ai-diff-type="suggested"[^>]*>[\s\S]*?<\/div>/,
            `<p>${capturedSuggestedText}</p>`,
          );
          editor.commands.setContent(newHtml);
        };
      });
    };

    // 에디터 업데이트 시마다 체크
    editor.on('update', attachExistingButtons);
    attachExistingButtons(); // 초기 로드 시에도 실행

    return () => {
      editor.off('update', attachExistingButtons);
    };
  }, [editor]);

  // 에디터 내용 변경 감지 -> diff 모드 취소 (단, AI 작업 중이 아닐 때만)
  useEffect(() => {
    if (!showDiffModal || !editor) return;

    const handleUpdate = () => {
      // AI 작업 중이면 무시
      if (isAiOperating) {
        console.log('🤖 AI 작업 중 - diff 모드 유지');
        return;
      }

      // 일반 사용자 입력이면 diff 모드 취소
      console.log('⚠️ 사용자 입력 감지 - diff 모드 취소');
      setShowDiffModal(false);
    };

    editor.on('update', handleUpdate);
    return () => {
      editor.off('update', handleUpdate);
    };
  }, [showDiffModal, editor, isAiOperating]);

  // 훅 호출이 모두 끝난 뒤에 조기 반환 (훅 호출 순서 보장)
  if (!editor) return null;

  // AI 문법 수정
  const handleGrammarFix = async () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    if (!selectedText) return;

    setIsFixing(true);

    try {
      const response = await sendChatMessage({
        message: `다음 문장의 맞춤법, 문법, 띄어쓰기를 교정해주세요. 수정된 문장만 출력하고, 설명은 하지 마세요:\n\n${selectedText}`,
        model: 'gpt-4.1-nano',
      });

      if (response.message) {
        // AI 작업 시작
        setIsAiOperating(true);

        console.log('🎨 원본:', selectedText);
        console.log('🎨 제안:', response.message);

        // 선택된 텍스트를 두 개의 블록으로 교체 (버튼은 제안 블록에만 표시)
        editor
          .chain()
          .focus()
          .deleteRange({ from, to })
          .insertContentAt(from, [
            {
              type: 'aiDiffBlock',
              attrs: {
                type: 'original',
                text: selectedText,
                showButtons: false,
              },
            },
            {
              type: 'aiDiffBlock',
              attrs: {
                type: 'suggested',
                text: response.message,
                showButtons: true, // 제안 블록에만 버튼 표시
              },
            },
          ])
          .run();

        console.log('✅ AiDiffBlock 삽입 완료');

        // 값을 클로저로 캡처 (state가 초기화되어도 값 유지)
        const capturedOriginalText = selectedText;
        const capturedSuggestedText = response.message;

        // 버튼 클릭 이벤트 등록 (여러 번 시도, 강력한 이벤트)
        const attachListeners = () => {
          const undoBtn = document.querySelector('[data-ai-action="undo"]') as HTMLElement;
          const keepBtn = document.querySelector('[data-ai-action="keep"]') as HTMLElement;

          console.log('🔍 버튼 찾기:', { undoBtn, keepBtn });

          if (undoBtn && keepBtn) {
            console.log('✅ 버튼 발견, 이벤트 등록');
            console.log('캡처된 값:', { capturedOriginalText, capturedSuggestedText });

            // 클로저로 캡처된 값 사용
            const handleUndoClick = (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              console.log('🔴 Undo 버튼 클릭됨!');

              setIsAiOperating(true);
              const html = editor.getHTML();
              console.log('현재 HTML:', html);

              let newHtml = html.replace(
                /<div[^>]*data-ai-diff-type="original"[^>]*>[\s\S]*?<\/div>/,
                `<p>${capturedOriginalText}</p>`,
              );
              newHtml = newHtml.replace(
                /<div[^>]*data-ai-diff-type="suggested"[^>]*>[\s\S]*?<\/div>/,
                '',
              );

              editor.commands.setContent(newHtml);
              console.log('❌ Undo 완료!');

              setIsAiOperating(false);
            };

            const handleKeepClick = (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              console.log('🟢 Keep 버튼 클릭됨!');

              setIsAiOperating(true);
              const html = editor.getHTML();
              console.log('현재 HTML:', html);

              let newHtml = html.replace(
                /<div[^>]*data-ai-diff-type="original"[^>]*>[\s\S]*?<\/div>/,
                '',
              );
              newHtml = newHtml.replace(
                /<div[^>]*data-ai-diff-type="suggested"[^>]*>[\s\S]*?<\/div>/,
                `<p>${capturedSuggestedText}</p>`,
              );

              editor.commands.setContent(newHtml);
              console.log('✅ Keep 완료!');

              setIsAiOperating(false);
            };

            // 여러 이벤트 타입으로 등록
            undoBtn.addEventListener('click', handleUndoClick, true);
            undoBtn.addEventListener('mousedown', handleUndoClick, true);
            undoBtn.onmousedown = handleUndoClick;

            keepBtn.addEventListener('click', handleKeepClick, true);
            keepBtn.addEventListener('mousedown', handleKeepClick, true);
            keepBtn.onmousedown = handleKeepClick;
          } else {
            console.log('⏳ 버튼 아직 없음, 재시도...');
            setTimeout(attachListeners, 100);
          }
        };

        setTimeout(attachListeners, 100);

        setIsAiOperating(false);
        setShowDiffModal(false); // 버튼이 블록 안에 있으니 모달 불필요
      }
    } catch (error) {
      console.error('AI 문법 수정 오류:', error);
      alert('문법 수정 중 오류가 발생했습니다.');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <>
      <TiptapBubbleMenu
        editor={editor}
        pluginKey="bubbleMenu"
        shouldShow={({ editor, state }) => {
          if (!editor || !editor.view || !editor.view.dom) return false;
          const { selection } = state;
          return !selection.empty;
        }}
        className="flex items-center overflow-hidden rounded-lg border bg-white shadow-lg"
      >
        {/* AI 문법 수정 버튼 */}
        <button
          type="button"
          onClick={handleGrammarFix}
          disabled={isFixing}
          className={`p-1.5 transition-colors hover:bg-blue-50 ${
            isFixing ? 'cursor-wait opacity-50' : 'text-blue-600'
          }`}
          title={isFixing ? '수정 중...' : 'AI 문법 수정'}
        >
          {isFixing ? (
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <Sparkles size={14} />
          )}
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 transition-colors hover:bg-gray-100 ${
            editor.isActive('bold') ? 'bg-gray-100' : ''
          }`}
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 transition-colors hover:bg-gray-100 ${
            editor.isActive('italic') ? 'bg-gray-100' : ''
          }`}
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 transition-colors hover:bg-gray-100 ${
            editor.isActive('underline') ? 'bg-gray-100' : ''
          }`}
        >
          <Underline size={14} />
        </button>
        {/* 글자색 */}
        <div className="relative flex items-center" title="글자색">
          <div className="pointer-events-none absolute left-1.5">
            <span className="text-xs font-bold">A</span>
            <Palette size={14} className="text-gray-500" />
          </div>
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="h-8 w-8 cursor-pointer p-1 opacity-0"
          />
        </div>

        {/* 글자 크기 */}
        <div className="relative">
          <select
            value={editor?.getAttributes('textStyle').fontSize?.replace('px', '') || '16'}
            onChange={(e) => {
              editor
                ?.chain()
                .focus()
                .setMark('textStyle', { fontSize: `${e.target.value}px` })
                .run();
            }}
            className="h-8 rounded-sm border border-gray-200 px-2 text-sm focus:outline-hidden"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        {/* 폰트 패밀리 */}
        <div className="relative">
          <select
            value={editor?.getAttributes('textStyle').fontFamily || 'inherit'}
            onChange={(e) => {
              editor?.chain().focus().setFontFamily(e.target.value).run();
            }}
            className="h-8 rounded-sm border border-gray-200 px-2 text-sm focus:outline-hidden"
          >
            <option value="inherit">기본</option>
            <option value="Gamja Flower, cursive">감자꽃</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Times New Roman, serif">Times New Roman</option>
            <option value="Courier New, monospace">Courier New</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Verdana, sans-serif">Verdana</option>
            <option value="Tahoma, sans-serif">Tahoma</option>
            <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
            <option value="Impact, sans-serif">Impact</option>
            <option value="Comic Sans MS, cursive">Comic Sans MS</option>
          </select>
        </div>
      </TiptapBubbleMenu>

      {/* 표 버블 메뉴 */}
      <TiptapBubbleMenu
        editor={editor}
        pluginKey="tableBubbleMenu"
        shouldShow={({ editor }) => editor.isActive('table')}
        className="flex items-center gap-1 rounded-lg border bg-white p-1 shadow-lg"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className="rounded-sm p-1 hover:bg-gray-100"
          title="위에 행 추가"
        >
          <img src={ICONS.insert_up} alt="위에 행 추가" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className="rounded-sm p-1 hover:bg-gray-100"
          title="아래에 행 추가"
        >
          <img src={ICONS.insert_down} alt="아래에 행 추가" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className="rounded-sm p-1 hover:bg-gray-100"
          title="왼쪽에 열 추가"
        >
          <img src={ICONS.insert_left} alt="왼쪽에 열 추가" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className="rounded-sm p-1 hover:bg-gray-100"
          title="오른쪽에 열 추가"
        >
          <img src={ICONS.insert_right} alt="오른쪽에 열 추가" width={16} height={16} />
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteRow().run()}
          className="rounded-sm p-1 hover:bg-gray-100"
          title="행 삭제"
        >
          <img
            src={ICONS.remove_row}
            alt="행 삭제"
            width={16}
            height={16}
            className="text-red-500"
          />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className="rounded-sm p-1 hover:bg-gray-100"
          title="열 삭제"
        >
          <img
            src={ICONS.remove_column}
            alt="열 삭제"
            width={16}
            height={16}
            className="text-red-500"
          />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteTable().run()}
          className="rounded-sm p-1 hover:bg-gray-100"
          title="표 삭제"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().mergeCells().run()}
          className="rounded-sm p-1 hover:bg-gray-100"
          title="셀 병합"
        >
          <img src={ICONS.merge} alt="셀 병합" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().splitCell().run()}
          className="rounded-sm p-1 hover:bg-gray-100"
          title="셀 분할"
        >
          <img src={ICONS.divide} alt="셀 분할" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            const dom = editor.view.dom.querySelector('table');
            if (dom) {
              dom.style.width = dom.style.width || '285px';
              dom.style.marginLeft = '0';
              dom.style.marginRight = 'auto';
            }
          }}
          className="rounded-sm p-1 hover:bg-gray-100"
          title="표 왼쪽 정렬"
        >
          <img src={ICONS.align_left} alt="표 왼쪽 정렬" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            const dom = editor.view.dom.querySelector('table');
            if (dom) {
              dom.style.width = dom.style.width || '285px';
              dom.style.marginLeft = 'auto';
              dom.style.marginRight = 'auto';
            }
          }}
          className="rounded-sm p-1 hover:bg-gray-100"
          title="표 가운데 정렬"
        >
          <img src={ICONS.align_center} alt="표 가운데 정렬" width={16} height={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            const dom = editor.view.dom.querySelector('table');
            if (dom) {
              dom.style.width = dom.style.width || '285px';
              dom.style.marginLeft = 'auto';
              dom.style.marginRight = '0';
            }
          }}
          className="rounded-sm p-1 hover:bg-gray-100"
          title="표 오른쪽 정렬"
        >
          <img src={ICONS.align_right} alt="표 오른쪽 정렬" width={16} height={16} />
        </button>
      </TiptapBubbleMenu>
    </>
  );
}
