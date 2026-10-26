/**
 * 미리보기 전용 윈도우
 */

'use client';

import React, { useSyncExternalStore } from 'react';
import { Eye } from 'lucide-react';
import { PostPreview } from '@/components/features/post/form/PostPreview';
import type { BasePost } from '@/types/post';

interface PreviewWindowContentProps {
  post: Partial<BasePost>;
  showCard?: boolean;
  showLayout?: boolean;
}

// 뷰어는 클라이언트에서만 렌더 (SSR/하이드레이션 중에는 false)
const noopSubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function PreviewWindowContent({
  post,
  showCard = true,
  showLayout = true,
}: PreviewWindowContentProps) {
  const isViewerMounted = useSyncExternalStore(noopSubscribe, getClientSnapshot, getServerSnapshot);

  // useMemo 제거: 실시간 반영이 더 중요
  // post가 변경될 때마다 즉시 업데이트

  return (
    <div className="h-full overflow-auto bg-gray-50/80">
      <div className="p-6">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-1 text-lg font-semibold text-gray-800">실시간 미리보기</h2>
              <p className="text-xs text-gray-600">작성 중인 내용이 실시간으로 표시됩니다</p>
            </div>
            {!post.title && !post.content && (
              <span className="rounded-full bg-gray-200/50 px-3 py-1.5 text-xs text-gray-500">
                내용을 입력해주세요
              </span>
            )}
          </div>
        </div>

        <PostPreview
          post={post}
          isViewerMounted={isViewerMounted}
          showCard={showCard}
          showLayout={showLayout}
        />
      </div>
    </div>
  );
}

// 기본 아이콘
export function PreviewWindowIcon() {
  return <Eye size={14} />;
}
